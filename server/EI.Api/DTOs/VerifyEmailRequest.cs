using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class VerifyEmailRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
}
