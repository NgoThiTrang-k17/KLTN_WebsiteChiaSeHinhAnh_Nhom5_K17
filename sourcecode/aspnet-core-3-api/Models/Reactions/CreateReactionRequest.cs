using System;
using WebApi.Entities;

namespace WebApi.Models.Reactions
{
    public class CreateReactionRequest
    {
        public ReactionType Type { get; set; }
        public DateTime Created { get; set; }
        public int OwnerId { get; set; }
        public ReactionTarget Target { get; set; }
        public int TargetId { get; set; }
    }
}