using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class Subject
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
