﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Comments
{
    public class CommentResponse
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }

        public int? ParrentId { get; set; }
        public bool IsParent => !ParrentId.HasValue;
        public bool IsChild => ParrentId.HasValue;

        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string OwnerAvatar { get; set; }
        public int PostId { get; set; }

    }
}
