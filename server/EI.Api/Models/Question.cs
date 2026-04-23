using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class Question
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("test_id")]
    public int TestId { get; set; }

    [JsonPropertyName("test")]
    public Test? Test { get; set; }

    [JsonPropertyName("question_text")]
    public string QuestionText { get; set; } = string.Empty;

    [JsonPropertyName("options")]
    public List<string> Options { get; set; } = [];

    [JsonPropertyName("correct_index")]
    public int CorrectIndex { get; set; }

    [JsonPropertyName("point")]
    public int Point { get; set; } = 1;
}
