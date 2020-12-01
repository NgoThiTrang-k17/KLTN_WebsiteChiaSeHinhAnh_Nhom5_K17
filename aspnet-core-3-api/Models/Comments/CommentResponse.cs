using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Comments
{
    public class CommentResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public int OwnerId { get; set; }
        public int PostId { get; set; }
    }
}
