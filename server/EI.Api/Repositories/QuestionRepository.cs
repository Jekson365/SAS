using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class QuestionRepository : IQuestionRepository
{
    private readonly AppDbContext _db;

    public QuestionRepository(AppDbContext appDbContext)
    {
        _db = appDbContext;
    }

    public async Task<IEnumerable<Question>> GetAllAsync() =>
        await _db.Questions.Include(q => q.Test).ToListAsync();

    public async Task<Question?> GetByIdAsync(int id) =>
        await _db.Questions.FindAsync(id);

    public async Task AddAsync(Question entity) =>
        await _db.Questions.AddAsync(entity);

    public void Update(Question entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(Question entity) =>
        _db.Questions.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<IEnumerable<Question>> GetByTestIdAsync(int testId) =>
        await _db.Questions.Where(q => q.TestId == testId).ToListAsync();
}
