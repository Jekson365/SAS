using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class LoginRequest
{
    [JsonPropertyName("private_number")]
    public string PrivateNumber { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}
