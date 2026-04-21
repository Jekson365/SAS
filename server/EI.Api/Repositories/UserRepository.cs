using EI.Api.Data;
using EI.Api.Interfaces;
using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext appDbContext)
    {
        _db = appDbContext;
    }

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await _db.Users.ToListAsync();

    public async Task<User?> GetByIdAsync(int id) =>
        await _db.Users.FindAsync(id);

    public async Task AddAsync(User entity) =>
        await _db.Users.AddAsync(entity);

    public void Update(User entity) =>
        _db.Entry(entity).State = EntityState.Modified;

    public void Remove(User entity) =>
        _db.Users.Remove(entity);

    public async Task SaveAsync() =>
        await _db.SaveChangesAsync();

    public async Task<User?> GetByAuthParamAsync(string authParam)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.PrivateNumber == authParam);
    }

    public Task<User?> GetByEmailAsync(string email) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public Task<bool> ExistsByEmailAsync(string email) =>
        _db.Users.AnyAsync(u => u.Email == email);

    public Task<bool> ExistsByPrivateNumberAsync(string hashedPrivateNumber) =>
        _db.Users.AnyAsync(u => u.PrivateNumber == hashedPrivateNumber);

    public Task<bool> ExistsByMobileNumberAsync(string hashedMobileNumber) =>
        _db.Users.AnyAsync(u => u.MobileNumber == hashedMobileNumber);
}
    
