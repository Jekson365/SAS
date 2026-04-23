using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class CreateTestRequest
{
    [JsonPropertyName("subject_id")]
    public int SubjectId { get; set; }

    [JsonPropertyName("etapi")]
    public string Etapi { get; set; } = string.Empty;

    [JsonPropertyName("test_start_date")]
    public DateTime TestStartDate { get; set; }

    [JsonPropertyName("pass_score")]
    public int PassScore { get; set; }

    [JsonPropertyName("questions")]
    public List<CreateQuestionDto> Questions { get; set; } = [];
}
