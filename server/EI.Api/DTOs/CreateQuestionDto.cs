using System.Text.Json.Serialization;

namespace EI.Api.DTOs;

public class CreateQuestionDto
{
    [JsonPropertyName("question_text")]
    public string QuestionText { get; set; } = string.Empty;

    [JsonPropertyName("options")]
    public List<string> Options { get; set; } = [];

    [JsonPropertyName("correct_index")]
    public int CorrectIndex { get; set; }

    [JsonPropertyName("point")]
    public int Point { get; set; } = 1;
}
