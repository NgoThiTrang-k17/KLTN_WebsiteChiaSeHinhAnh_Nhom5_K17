using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Helpers
{
    public class MessageParams: PaginationParams
    {
        public int CurrentUserId { get; set; }

        public string Container { get; set; } = "Unread";
    }
}
