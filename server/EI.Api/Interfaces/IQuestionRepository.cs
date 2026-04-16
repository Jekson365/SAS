using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface IQuestionRepository : IRepository<Question>
{
    Task<IEnumerable<Question>> GetByTestIdAsync(int testId);
}
