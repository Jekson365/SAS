using EI.Api.DTOs;

namespace EI.Api.Interfaces;

public record PendingRegistration(RegisterRequest Request, string Code, DateTime ExpiresAt);

public interface IVerificationStore
{
    void Store(string email, RegisterRequest request, string code, TimeSpan ttl);
    PendingRegistration? Get(string email);
    void Remove(string email);
}
