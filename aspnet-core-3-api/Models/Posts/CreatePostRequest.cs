using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Posts
{
    public class CreatePostRequest
    {
        public int Id { get; set; }
        public string PostTitle { get; set; }
        public DateTime Created { get; set; }
        public string ImageName { get; set; }
        public string ImagePath { get; set; }
        public int OwnerId { get; set; }

    }
}