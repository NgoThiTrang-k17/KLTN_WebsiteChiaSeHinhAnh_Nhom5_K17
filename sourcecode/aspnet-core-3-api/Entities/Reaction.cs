using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public enum ReactionType
    {
        Like = 0, Dislike
    }
    public enum ReactionTarget
    {
        Post = 0, Comment
    }
    public class Reaction
    {
        public int Id { get; set; }
        public ReactionType Type { get; set; }
        public DateTime Created { get; set; }
        public int OwnerId { get; set; }
        public ReactionTarget Target { get; set; }
        public int TargetId { get; set; }
    }
}
