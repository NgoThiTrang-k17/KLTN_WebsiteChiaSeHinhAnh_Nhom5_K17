using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace WebApi.Entities
{
    public class Post
    {
        public int Id { get; set; }
        public string PostTitle { get; set; }
        public DateTime Created { get; set; }
        public string ImageName { get; set; }
        public string ImagePath { get; set; }
        public int OwnerId { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
    }
}