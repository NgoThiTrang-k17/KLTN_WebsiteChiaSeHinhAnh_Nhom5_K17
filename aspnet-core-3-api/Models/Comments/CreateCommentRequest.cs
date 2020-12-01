using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Comments
{
    public class CreateCommentRequest
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public DateTime DateCreated { get; set; }
        [Required]
        public int OwnerId { get; set; }
        [Required]
        public int PostId { get; set; }
    }
}
