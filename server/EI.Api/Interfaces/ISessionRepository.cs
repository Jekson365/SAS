using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface ISessionRepository : IRepository<Session>
{
    Task<Session?> GetByTokenAsync(string token);
    Task DeleteByUserIdAsync(int userId);
}
