using Microsoft.AspNetCore.Http;
using System;

namespace WebApi.Models.Posts
{
    
    public class PostResponse
    {
        public int Id { get; set; }
        public string PostTitle { get; set; }
        public DateTime Created { get; set; }
        public string ImagePath { get; set; }
        public int OwnerId { get; set; }
    }
}