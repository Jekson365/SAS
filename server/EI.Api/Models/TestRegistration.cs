using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class TestRegistration
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("user")]
    public User? User { get; set; }

    [JsonPropertyName("test_id")]
    public int TestId { get; set; }

    [JsonPropertyName("test")]
    public Test? Test { get; set; }

    [JsonPropertyName("registration_date")]
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("is_paid")]
    public bool IsPaid { get; set; }
}
