using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface ITestRepository : IRepository<Test>
{
    Task<IEnumerable<Test>> GetAllWithSubjectAsync();
    Task<Test?> GetByIdWithSubjectAsync(int id);
}
