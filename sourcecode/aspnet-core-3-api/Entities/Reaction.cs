using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public enum ReactionType
    {
        Like,
    }
    public class Reaction
    {
       
        public int Id { get; set; }
        public ReactionType ReactionType { get; set; }
        public DateTime DateCreated { get; set; }
        public int OwnerId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
