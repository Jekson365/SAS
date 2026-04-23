using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class Test
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("subject_id")]
    public int SubjectId { get; set; }

    [JsonPropertyName("subject")]
    public Subject Subject { get; set; } = null!;

    [JsonPropertyName("etapi")]
    public string Etapi { get; set; } = string.Empty;

    [JsonPropertyName("test_start_date")]
    public DateTime TestStartDate { get; set; }

    [JsonPropertyName("max_score")]
    public int MaxScore { get; set; }

    [JsonPropertyName("pass_score")]
    public int PassScore { get; set; }

    [JsonPropertyName("final_score")]
    public int? FinalScore { get; set; }

    [JsonPropertyName("succeed")]
    public bool? Succeed { get; set; }
    [JsonPropertyName("on_going")]
    public bool OnGoing {get;set;}

    [JsonPropertyName("duration_minutes")]
    public int DurationMinutes { get; set; }

    [JsonPropertyName("started_at")]
    public DateTime? StartedAt { get; set; }
}
