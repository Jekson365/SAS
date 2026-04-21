using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class User
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("surname")]
    public string Surname { get; set; } = string.Empty;

    [JsonPropertyName("private_number")]
    public string PrivateNumber { get; set; } = string.Empty;

    [JsonPropertyName("mobile_number")]
    public string MobileNumber { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [JsonPropertyName("role")]
    public UserRole Role { get; set; } = UserRole.User;

    [JsonPropertyName("is_verified")]
    public bool IsVerified { get; set; } = false;

    [JsonPropertyName("verification_code")]
    public string? VerificationCode { get; set; }

    [JsonPropertyName("verification_expires_at")]
    public DateTime? VerificationExpiresAt { get; set; }
}
