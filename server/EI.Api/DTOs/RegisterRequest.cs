using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class RegisterRequest
{
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
}
