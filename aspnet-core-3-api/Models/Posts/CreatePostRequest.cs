using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models.Posts
{
    public class CreatePostRequest
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Path { get; set; }
        [Required]
        public int OwnerId {get; set;}

    }
}