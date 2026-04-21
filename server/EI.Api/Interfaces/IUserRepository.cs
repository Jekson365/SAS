using EI.Api.Models;

namespace EI.Api.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByAuthParamAsync(string PrivateNumber);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByPrivateNumberAsync(string hashedPrivateNumber);
    Task<bool> ExistsByMobileNumberAsync(string hashedMobileNumber);
}
