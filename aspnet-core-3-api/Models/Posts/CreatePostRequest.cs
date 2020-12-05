using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Posts
{
    public class CreatePostRequest
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string PostTitle { get; set; }
        [Required]
        public DateTime Created { get; set; }
        [Required]
        public string ImagePath { get; set; }
        [Required]
        public int OwnerId {get; set;}

    }
}