using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class SessionRepository : ISessionRepository
{
    private readonly AppDbContext _db;

    public SessionRepository(AppDbContext appDbContext)
    {
        _db = appDbContext;
    }

    public async Task<IEnumerable<Session>> GetAllAsync() =>
        await _db.Sessions.ToListAsync();

    public async Task<Session?> GetByIdAsync(int id) =>
        await _db.Sessions.FindAsync(id);

    public async Task AddAsync(Session entity) =>
        await _db.Sessions.AddAsync(entity);

    public void Update(Session entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(Session entity) =>
        _db.Sessions.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<Session?> GetByTokenAsync(string token) =>
        await _db.Sessions.Include(s => s.User).FirstOrDefaultAsync(s => s.Token == token);

    public async Task DeleteByUserIdAsync(int userId)
    {
        var sessions = await _db.Sessions.Where(s => s.UserId == userId).ToListAsync();
        _db.Sessions.RemoveRange(sessions);
        await _db.SaveChangesAsync();
    }
}
