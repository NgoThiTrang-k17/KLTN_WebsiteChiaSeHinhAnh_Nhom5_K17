using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Models.Reactions
{
    public class ReactionState
    {
        public int IsCreated { get; set; }
        public bool IsReactedByThisUser { get; set; }
    }
}
