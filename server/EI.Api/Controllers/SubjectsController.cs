using EI.Api.Models;
using EI.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubjectsController(ISubjectRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await repo.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subject = await repo.GetByIdAsync(id);
        return subject is null ? NotFound() : Ok(subject);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Subject subject)
    {
        await repo.AddAsync(subject);
        await repo.SaveAsync();
        return CreatedAtAction(nameof(GetById), new { id = subject.Id }, subject);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Subject updated)
    {
        if (id != updated.Id) return BadRequest();
        repo.Update(updated);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var subject = await repo.GetByIdAsync(id);
        if (subject is null) return NotFound();
        repo.Remove(subject);
        await repo.SaveAsync();
        return NoContent();
    }
}
