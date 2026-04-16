using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class TestResult
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

    [JsonPropertyName("score")]
    public int Score { get; set; }

    [JsonPropertyName("passed")]
    public bool Passed { get; set; }

    [JsonPropertyName("submitted_at")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}
