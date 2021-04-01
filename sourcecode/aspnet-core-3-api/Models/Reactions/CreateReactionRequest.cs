﻿using System;
using WebApi.Entities;

namespace WebApi.Models.Reactions
{
    public class CreateReactionRequest
    {
        public ReactionType ReactionType { get; set; }
        public DateTime DateCreated { get; set; }
        public int OwnerId { get; set; }
        public int PostId { get; set; }

    }
}