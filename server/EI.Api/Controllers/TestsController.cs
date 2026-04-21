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
            TestStartDate = DateTime.SpecifyKind(request.TestStartDate, DateTimeKind.Utc),
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
    public async Task<IActionResult> Update(int id, CreateTestRequest request)
    {
        var test = await repo.GetByIdAsync(id);
        if (test is null) return NotFound();

        if (test.OnGoing)
            return Conflict(new { message = "Cannot edit a test that is currently ongoing. Stop it first." });

        test.SubjectId     = request.SubjectId;
        test.Etapi         = request.Etapi;
        test.TestStartDate = DateTime.SpecifyKind(request.TestStartDate, DateTimeKind.Utc);
        test.MaxScore      = request.MaxScore;
        test.PassScore     = request.PassScore;

        repo.Update(test);

        var existing = await questionRepo.GetByTestIdAsync(id);
        foreach (var q in existing)
            questionRepo.Remove(q);

        foreach (var q in request.Questions)
        {
            await questionRepo.AddAsync(new Question
            {
                TestId       = id,
                QuestionText = q.QuestionText,
                Options      = q.Options,
                CorrectIndex = q.CorrectIndex,
            });
        }

        await repo.SaveAsync();
        await questionRepo.SaveAsync();

        return NoContent();
    }

    [HttpPost("{id:int}/start")]
    public async Task<IActionResult> Start(int id)
    {
        var test = await repo.GetByIdAsync(id);
        if (test is null) return NotFound();

        test.OnGoing = true;
        repo.Update(test);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/stop")]
    public async Task<IActionResult> Stop(int id)
    {
        var test = await repo.GetByIdAsync(id);
        if (test is null) return NotFound();

        test.OnGoing = false;
        repo.Update(test);
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
