using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Helpers
{
    public class UserParams : PaginationParams
    {
        

        public int CurrentUserId { get; set; }

        public string Gender { get; set; }

        public int MinAge { get; set; } = 18;

        public int MaxAge { get; set; } = 165;

        public string OrderBy { get; set; } = "lastActive";
    }
}
