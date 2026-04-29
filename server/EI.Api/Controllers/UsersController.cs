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
    private readonly IHashingService _hasher;
    private readonly IEmailService _emailService;
    private readonly ILogger<UsersController> _logger;
    private readonly IConfiguration _config;

    public UsersController(
        IUserRepository userRepo,
        ISessionRepository sessionRepo,
        IHashingService hasher,
        IEmailService emailService,
        ILogger<UsersController> logger,
        IConfiguration config)
    {
        _userRepo     = userRepo;
        _sessionRepo  = sessionRepo;
        _hasher       = hasher;
        _emailService = emailService;
        _logger       = logger;
        _config       = config;
    }

    // ── POST api/users/test-email ─────────────────────────────────────────────
    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromQuery] string to)
    {
        if (string.IsNullOrWhiteSpace(to))
            return BadRequest(new { message = "Query parameter 'to' is required." });

        try
        {
            await _emailService.SendAsync(
                to,
                "EI.Api SMTP test",
                $"This is a test email sent at {DateTime.UtcNow:O}. If you see this, SMTP is configured correctly.");
            return Ok(new { message = $"Sent test email to {to}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Test email failed for {To}", to);
            return StatusCode(500, new { message = "Email send failed.", error = ex.Message });
        }
    }

    // ── POST api/users/register ───────────────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var existing = await _userRepo.GetByEmailAsync(request.Email);
        if (existing is not null && existing.IsVerified)
            return Conflict(new { message = "Email already in use." });

        if (existing is not null)
        {
            _userRepo.Remove(existing);
            await _userRepo.SaveAsync();
        }

        var hashedPrivateNumber = _hasher.HashPrivateNumber(request.PrivateNumber);
        var hashedMobileNumber  = _hasher.HashMobileNumber(request.MobileNumber);

        if (await _userRepo.ExistsByPrivateNumberAsync(hashedPrivateNumber))
            return Conflict(new { message = "Private number already in use." });
        // if (await _userRepo.ExistsByMobileNumberAsync(hashedMobileNumber))
        //     return Conflict(new { message = "Mobile number already in use." });

        var code = Random.Shared.Next(100000, 1000000).ToString();
        var user = new User
        {
            Name                  = request.Name,
            Surname               = request.Surname,
            PrivateNumber         = hashedPrivateNumber,
            MobileNumber          = hashedMobileNumber,
            Email                 = request.Email,
            Password              = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role                  = UserRole.User,
            IsVerified            = false,
            VerificationCode      = code,
            VerificationExpiresAt = DateTime.UtcNow.AddMinutes(2)
        };

        await _userRepo.AddAsync(user);
        await _userRepo.SaveAsync();

        try
        {
            await _emailService.SendAsync(
                request.Email,
                "Your verification code",
                $"Your verification code is: {code}\n\nIt expires in 2 minutes.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Email send failed for {Email}. Dev fallback — code: {Code}", request.Email, code);
        }

        return Accepted(new { email = request.Email });
    }

    // ── POST api/users/verify ─────────────────────────────────────────────────
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailRequest request)
    {
        var user = await _userRepo.GetByEmailAsync(request.Email);
        if (user is null || user.VerificationCode is null)
            return BadRequest(new { message = "Verification not requested." });

        if (user.IsVerified)
            return BadRequest(new { message = "Email already verified." });

        if (user.VerificationExpiresAt is null || user.VerificationExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Verification code expired. Please register again." });

        if (user.VerificationCode != request.Code)
            return BadRequest(new { message = "Invalid verification code." });

        user.IsVerified            = true;
        user.VerificationCode      = null;
        user.VerificationExpiresAt = null;
        _userRepo.Update(user);
        await _userRepo.SaveAsync();

        var response = await CreateSessionAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, response);
    }

    // ── POST api/users/login ──────────────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userRepo.GetByAuthParamAsync(_hasher.HashPrivateNumber(request.PrivateNumber));
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Invalid email or password." });

        if (!user.IsVerified)
            return Unauthorized(new { message = "Please verify your email before logging in." });

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
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role,               user.Role.ToString())
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
