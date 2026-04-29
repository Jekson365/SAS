using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController(IEventRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await repo.GetAllWithTestsAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ev = await repo.GetByIdWithTestsAsync(id);
        return ev is null ? NotFound() : Ok(ev);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Event request)
    {
        var ev = new Event
        {
            Name        = request.Name,
            Description = request.Description ?? string.Empty,
            EventDate   = DateTime.SpecifyKind(request.EventDate, DateTimeKind.Utc),
        };
        await repo.AddAsync(ev);
        await repo.SaveAsync();
        return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Event request)
    {
        var ev = await repo.GetByIdAsync(id);
        if (ev is null) return NotFound();

        ev.Name        = request.Name;
        ev.Description = request.Description ?? string.Empty;
        ev.EventDate   = DateTime.SpecifyKind(request.EventDate, DateTimeKind.Utc);

        repo.Update(ev);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ev = await repo.GetByIdAsync(id);
        if (ev is null) return NotFound();
        repo.Remove(ev);
        await repo.SaveAsync();
        return NoContent();
    }
}
