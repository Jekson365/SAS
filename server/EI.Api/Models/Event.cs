using System.Text.Json.Serialization;

namespace EI.Api.Models;

public class Event
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("event_date")]
    public DateTime EventDate { get; set; }

    [JsonPropertyName("tests")]
    public List<Test> Tests { get; set; } = [];
}
