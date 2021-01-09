using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class Follow
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int FollowerId { get; set; }
        public Status Status { get; set; }
    }
}
