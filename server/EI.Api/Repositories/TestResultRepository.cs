using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class TestResultRepository : ITestResultRepository
{
    private readonly AppDbContext _db;

    public TestResultRepository(AppDbContext appDbContext)
    {
        _db = appDbContext;
    }

    public async Task<IEnumerable<TestResult>> GetAllAsync() =>
        await _db.TestResults.Include(r => r.User).Include(r => r.Test).ThenInclude(t => t.Subject).ToListAsync();

    public async Task<TestResult?> GetByIdAsync(int id) =>
        await _db.TestResults.Include(r => r.User).Include(r => r.Test).ThenInclude(t => t.Subject).FirstOrDefaultAsync(r => r.Id == id);

    public async Task AddAsync(TestResult entity) =>
        await _db.TestResults.AddAsync(entity);

    public void Update(TestResult entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(TestResult entity) =>
        _db.TestResults.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<IEnumerable<TestResult>> GetByUserIdAsync(int userId) =>
        await _db.TestResults.Include(r => r.Test).ThenInclude(t => t.Subject).Where(r => r.UserId == userId).ToListAsync();

    public async Task<IEnumerable<TestResult>> GetByTestIdAsync(int testId) =>
        await _db.TestResults.Include(r => r.User).Where(r => r.TestId == testId).ToListAsync();
}
