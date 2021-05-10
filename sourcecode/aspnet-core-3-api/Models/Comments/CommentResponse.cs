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
        public DateTime Created { get; set; }

        public int ParrentId { get; set; }
        public bool IsParent => ParrentId == 0;
        public bool IsChild => ParrentId != 0;
        public int ChildCount { get; set; }
        public int ReactionCount { get; set; }

        public int OwnerId { get; set; }
        public bool IsReactedByThisUser { get;  set; }
        public string OwnerName { get; set; }
        public string OwnerAvatar { get; set; }
        public int PostId { get; set; }
    }
}
