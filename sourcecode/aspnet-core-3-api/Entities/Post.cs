
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApi.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public string Categories { get; set; }
        public string Path { get; set; }

        public int OwnerId { get; set; }
    }

    // Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);
    public class Tag
    {
        [JsonPropertyName("en")]
        public string En { get; set; }
    }

    public class TagDetail
    {
        [JsonPropertyName("confidence")]
        public double Confidence { get; set; }

        [JsonPropertyName("tag")]
        public Tag Tag { get; set; }
    }

    public class Result
    {
        [JsonPropertyName("tags")]
        public List<TagDetail> Tags { get; set; }
    }

    public class Statuss
    {
        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }
    }

    public class CategorizerResult
    {
        [JsonPropertyName("result")]
        public Result Result { get; set; }

        [JsonPropertyName("status")]
        public Statuss Status { get; set; }
    }




}