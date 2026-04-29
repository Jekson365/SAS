using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class TestRepository(AppDbContext db) : ITestRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IEnumerable<Test>> GetAllAsync() =>
        await _db.Tests.ToListAsync();

    public async Task<Test?> GetByIdAsync(int id) =>
        await _db.Tests.FindAsync(id);

    public async Task AddAsync(Test entity) =>
        await _db.Tests.AddAsync(entity);

    public void Update(Test entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(Test entity) =>
        _db.Tests.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<IEnumerable<Test>> GetAllWithSubjectAsync() =>
        await _db.Tests.Include(t => t.Subject).Include(t => t.Event).ToListAsync();

    public async Task<Test?> GetByIdWithSubjectAsync(int id) =>
        await _db.Tests.Include(t => t.Subject).Include(t => t.Event).FirstOrDefaultAsync(t => t.Id == id);
}
