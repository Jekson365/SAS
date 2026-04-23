using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class TestRegistrationRepository : ITestRegistrationRepository
{
    private readonly AppDbContext _db;

    public TestRegistrationRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<TestRegistration>> GetAllAsync() =>
        await _db.TestRegistrations.ToListAsync();

    public async Task<TestRegistration?> GetByIdAsync(int id) =>
        await _db.TestRegistrations.FirstOrDefaultAsync(r => r.Id == id);

    public async Task AddAsync(TestRegistration entity) =>
        await _db.TestRegistrations.AddAsync(entity);

    public void Update(TestRegistration entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(TestRegistration entity) =>
        _db.TestRegistrations.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<IEnumerable<TestRegistration>> GetByUserIdAsync(int userId) =>
        await _db.TestRegistrations.Where(r => r.UserId == userId).ToListAsync();

    public async Task<TestRegistration?> GetByUserAndTestAsync(int userId, int testId) =>
        await _db.TestRegistrations.FirstOrDefaultAsync(r => r.UserId == userId && r.TestId == testId);
}
