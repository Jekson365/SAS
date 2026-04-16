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

    [JsonPropertyName("test_taken_date")]
    public DateOnly TestTakenDate { get; set; }

    [JsonPropertyName("max_score")]
    public int MaxScore { get; set; }

    [JsonPropertyName("pass_score")]
    public int PassScore { get; set; }

    [JsonPropertyName("final_score")]
    public int? FinalScore { get; set; }

    [JsonPropertyName("succeed")]
    public bool? Succeed { get; set; }
}
