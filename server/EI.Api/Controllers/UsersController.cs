using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EI.Api.DTOs;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepo;
    private readonly ISessionRepository _sessionRepo;
    private readonly IConfiguration _config;

    public UsersController(IUserRepository userRepo, ISessionRepository sessionRepo, IConfiguration config)
    {
        _userRepo    = userRepo;
        _sessionRepo = sessionRepo;
        _config      = config;
    }

    // ── POST api/users/register ───────────────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var existing = await _userRepo.GetByEmailAsync(request.Email);
        if (existing is not null)
            return Conflict(new { message = "Email already in use." });

        var user = new User
        {
            Name          = request.Name,
            Surname       = request.Surname,
            PrivateNumber = request.PrivateNumber,
            MobileNumber  = request.MobileNumber,
            Email         = request.Email,
            Password      = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        await _userRepo.AddAsync(user);
        await _userRepo.SaveAsync();

        var response = await CreateSessionAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, response);
    }

    // ── POST api/users/login ──────────────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userRepo.GetByEmailAsync(request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        await _sessionRepo.DeleteByUserIdAsync(user.Id);

        var response = await CreateSessionAsync(user);
        return Ok(response);
    }

    // ── POST api/users/logout ─────────────────────────────────────────────────
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var session = await _sessionRepo.GetByTokenAsync(token);
        if (session is not null)
        {
            _sessionRepo.Remove(session);
            await _sessionRepo.SaveAsync();
        }
        return NoContent();
    }

    // ── GET api/users ─────────────────────────────────────────────────────────
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _userRepo.GetAllAsync());

    // ── GET api/users/{id} ────────────────────────────────────────────────────
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    // ── PUT api/users/{id} ────────────────────────────────────────────────────
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, User updated)
    {
        if (id != updated.Id) return BadRequest();
        _userRepo.Update(updated);
        await _userRepo.SaveAsync();
        return NoContent();
    }

    // ── DELETE api/users/{id} ─────────────────────────────────────────────────
    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _userRepo.GetByIdAsync(id);
        if (user is null) return NotFound();
        _userRepo.Remove(user);
        await _userRepo.SaveAsync();
        return NoContent();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private async Task<AuthResponse> CreateSessionAsync(User user)
    {
        var expiresAt = DateTime.UtcNow.AddHours(
            double.Parse(_config["Jwt:ExpiresInHours"]!));

        var token = GenerateJwtToken(user, expiresAt);

        var session = new Session
        {
            UserId    = user.Id,
            Token     = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        };

        await _sessionRepo.AddAsync(session);
        await _sessionRepo.SaveAsync();

        return new AuthResponse
        {
            Token     = token,
            ExpiresAt = expiresAt,
            UserId    = user.Id,
            Email     = user.Email
        };
    }

    private string GenerateJwtToken(User user, DateTime expiresAt)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
        };

        var jwt = new JwtSecurityToken(
            issuer:             _config["Jwt:Issuer"],
            audience:           _config["Jwt:Audience"],
            claims:             claims,
            expires:            expiresAt,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
