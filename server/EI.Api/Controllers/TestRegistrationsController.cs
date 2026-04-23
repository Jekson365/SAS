using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestRegistrationsController(ITestRegistrationRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await repo.GetAllAsync());

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetByUser(int userId) =>
        Ok(await repo.GetByUserIdAsync(userId));

    [HttpPost]
    public async Task<IActionResult> Create(TestRegistration body)
    {
        var existing = await repo.GetByUserAndTestAsync(body.UserId, body.TestId);
        if (existing is not null)
        {
            if (body.IsPaid && !existing.IsPaid)
            {
                existing.IsPaid = true;
                repo.Update(existing);
                await repo.SaveAsync();
            }
            return Ok(existing);
        }

        var reg = new TestRegistration
        {
            UserId           = body.UserId,
            TestId           = body.TestId,
            RegistrationDate = DateTime.UtcNow,
            IsPaid           = body.IsPaid,
        };

        await repo.AddAsync(reg);
        await repo.SaveAsync();
        return CreatedAtAction(nameof(GetByUser), new { userId = reg.UserId }, reg);
    }
}
