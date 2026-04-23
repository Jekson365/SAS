using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TestResultsController : ControllerBase
{
    private readonly ITestResultRepository _repo;
    private readonly ITestRegistrationRepository _regRepo;

    public TestResultsController(ITestResultRepository repo, ITestRegistrationRepository regRepo)
    {
        _repo = repo;
        _regRepo = regRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _repo.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetByUser(int userId) =>
        Ok(await _repo.GetByUserIdAsync(userId));

    [HttpGet("test/{testId:int}")]
    public async Task<IActionResult> GetByTest(int testId) =>
        Ok(await _repo.GetByTestIdAsync(testId));

    [HttpPost]
    public async Task<IActionResult> Create(TestResult result)
    {
        var reg = await _regRepo.GetByUserAndTestAsync(result.UserId, result.TestId);
        if (reg is null || !reg.IsPaid)
            return StatusCode(403, new { message = "რეგისტრაცია ან გადახდა არ არის დასრულებული." });

        result.SubmittedAt = DateTime.UtcNow;
        await _repo.AddAsync(result);
        await _repo.SaveAsync();
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _repo.GetByIdAsync(id);
        if (result is null) return NotFound();
        _repo.Remove(result);
        await _repo.SaveAsync();
        return NoContent();
    }
}
