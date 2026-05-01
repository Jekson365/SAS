using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface ITestResultRepository : IRepository<TestResult>
{
    Task<IEnumerable<TestResult>> GetByUserIdAsync(int userId);
    Task<IEnumerable<TestResult>> GetByTestIdAsync(int testId);
    Task<TestResult?> GetByUserAndTestAsync(int userId, int testId);
    Task<bool> ExistsForUserAndTestAsync(int userId, int testId);
}
