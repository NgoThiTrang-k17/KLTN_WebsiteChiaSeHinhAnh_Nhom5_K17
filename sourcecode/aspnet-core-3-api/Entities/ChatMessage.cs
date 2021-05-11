using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public int ChatRoomId { get; set; }
        public DateTime Created { get; set; }
    }
}
