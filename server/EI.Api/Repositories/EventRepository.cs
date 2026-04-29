using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class EventRepository(AppDbContext db) : IEventRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IEnumerable<Event>> GetAllAsync() =>
        await _db.Events.ToListAsync();

    public async Task<Event?> GetByIdAsync(int id) =>
        await _db.Events.FindAsync(id);

    public async Task AddAsync(Event entity) =>
        await _db.Events.AddAsync(entity);

    public void Update(Event entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(Event entity) =>
        _db.Events.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<IEnumerable<Event>> GetAllWithTestsAsync() =>
        await _db.Events
            .Include(e => e.Tests).ThenInclude(t => t.Subject)
            .ToListAsync();

    public async Task<Event?> GetByIdWithTestsAsync(int id) =>
        await _db.Events
            .Include(e => e.Tests).ThenInclude(t => t.Subject)
            .FirstOrDefaultAsync(e => e.Id == id);
}
