using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class CreateTestRequest
{
    [JsonPropertyName("subject_id")]
    public int SubjectId { get; set; }

    [JsonPropertyName("etapi")]
    public string Etapi { get; set; } = string.Empty;

    [JsonPropertyName("test_taken_date")]
    public DateOnly TestTakenDate { get; set; }

    [JsonPropertyName("max_score")]
    public int MaxScore { get; set; }

    [JsonPropertyName("pass_score")]
    public int PassScore { get; set; }

    [JsonPropertyName("questions")]
    public List<CreateQuestionDto> Questions { get; set; } = [];
}
