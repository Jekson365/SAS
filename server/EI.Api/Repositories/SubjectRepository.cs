using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class SubjectRepository : ISubjectRepository
{
    private readonly AppDbContext _db;
    public SubjectRepository(AppDbContext appDbContext)
    {
        _db = appDbContext;
    }

    public async Task<IEnumerable<Subject>> GetAllAsync() =>
        await _db.Subjects.ToListAsync();

    public async Task<Subject?> GetByIdAsync(int id) =>
        await _db.Subjects.FindAsync(id);

    public async Task AddAsync(Subject entity) =>
        await _db.Subjects.AddAsync(entity);

    public void Update(Subject entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(Subject entity) =>
        _db.Subjects.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();
}
