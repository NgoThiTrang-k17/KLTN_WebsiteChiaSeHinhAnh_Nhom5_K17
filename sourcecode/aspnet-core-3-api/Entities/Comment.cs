using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }

        public int? ParentId { get; set; }

        public int OwnerId { get; set; }
        public int PostId { get; set; }
    }
}
