using Microsoft.AspNetCore.Http;
using System;
using WebApi.Entities;

namespace WebApi.Models.Posts
{
    
    public class PostResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public string Categories { get; set; }
        public string Path { get; set; }

        public int OwnerId { get; set; }
        public bool IsReactedByThisUser { get;  set; }
        public string OwnerName { get; set; }
        public string OwnerAvatar { get; set; }
        public int FollowerCount { get; set; }
        public int CommentCount { get; set; }
        public int ReactionCount { get; set; }
    }
}