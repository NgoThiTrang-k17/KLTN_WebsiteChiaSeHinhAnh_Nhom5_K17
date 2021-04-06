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

        public int? ParentId { get; set; }
        public bool IsParent => !ParentId.HasValue;
        public bool IsChild => ParentId.HasValue;

        public int OwnerId { get; set; }
        public string OwnerName { get; set; }
        public string OwnerAvatar { get; set; }
        public int PostId { get; set; }

    }
}
