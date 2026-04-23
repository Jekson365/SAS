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

    [JsonPropertyName("type")]
    public string Type { get; set; } = "quiz";

    [JsonPropertyName("image_url")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("correct_answer")]
    public string? CorrectAnswer { get; set; }
}
