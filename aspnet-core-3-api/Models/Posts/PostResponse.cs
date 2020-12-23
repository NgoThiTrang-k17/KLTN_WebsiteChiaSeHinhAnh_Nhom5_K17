using Microsoft.AspNetCore.Http;
using System;
using WebApi.Entities;

namespace WebApi.Models.Posts
{
    
    public class PostResponse
    {
        public int Id { get; set; }
        public string PostTitle { get; set; }
        public DateTime Created { get; set; }
        public string ImagePath { get; set; }
        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string OwnerAvatar { get; set; }
    }
}