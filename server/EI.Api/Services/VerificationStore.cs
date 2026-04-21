using System.Collections.Concurrent;
using EI.Api.DTOs;
using EI.Api.Interfaces;

namespace EI.Api.Services;

public class VerificationStore : IVerificationStore
{
    private readonly ConcurrentDictionary<string, PendingRegistration> _pending = new();

    public void Store(string email, RegisterRequest request, string code, TimeSpan ttl)
    {
        _pending[Normalize(email)] = new PendingRegistration(request, code, DateTime.UtcNow.Add(ttl));
    }

    public PendingRegistration? Get(string email)
    {
        _pending.TryGetValue(Normalize(email), out var pending);
        return pending;
    }

    public void Remove(string email) => _pending.TryRemove(Normalize(email), out _);

    private static string Normalize(string email) => email.Trim().ToLowerInvariant();
}
