using EI.Api.DTOs;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestsController(ITestRepository repo, IQuestionRepository questionRepo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await repo.GetAllWithSubjectAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var test = await repo.GetByIdWithSubjectAsync(id);
        return test is null ? NotFound() : Ok(test);
    }

    [HttpGet("{id:int}/questions")]
    public async Task<IActionResult> GetQuestions(int id) =>
        Ok(await questionRepo.GetByTestIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Create(CreateTestRequest request)
    {
        var test = new Test
        {
            SubjectId    = request.SubjectId,
            Etapi        = request.Etapi,
            TestTakenDate = request.TestTakenDate,
            MaxScore     = request.MaxScore,
            PassScore    = request.PassScore,
        };

        await repo.AddAsync(test);
        await repo.SaveAsync();

        foreach (var q in request.Questions)
        {
            await questionRepo.AddAsync(new Question
            {
                TestId       = test.Id,
                QuestionText = q.QuestionText,
                Options      = q.Options,
                CorrectIndex = q.CorrectIndex,
            });
        }

        if (request.Questions.Count > 0)
            await questionRepo.SaveAsync();

        return CreatedAtAction(nameof(GetById), new { id = test.Id }, test);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Test updated)
    {
        if (id != updated.Id) return BadRequest();
        repo.Update(updated);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var test = await repo.GetByIdAsync(id);
        if (test is null) return NotFound();
        repo.Remove(test);
        await repo.SaveAsync();
        return NoContent();
    }
}
