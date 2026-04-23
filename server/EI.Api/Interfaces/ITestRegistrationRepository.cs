using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface ITestRegistrationRepository : IRepository<TestRegistration>
{
    Task<IEnumerable<TestRegistration>> GetByUserIdAsync(int userId);
    Task<TestRegistration?> GetByUserAndTestAsync(int userId, int testId);
}
