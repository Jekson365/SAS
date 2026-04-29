using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface IEventRepository : IRepository<Event>
{
    Task<IEnumerable<Event>> GetAllWithTestsAsync();
    Task<Event?> GetByIdWithTestsAsync(int id);
}
