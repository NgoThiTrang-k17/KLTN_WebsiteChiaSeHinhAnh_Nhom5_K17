using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class Message
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        //public int ChatRoomId { get; set; }

        public int RecipientId { get; set; }

        public string Content { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime? Read { get; set; }

        public bool SenderDeleted { get; set; }

        public bool RecipientDeleted { get; set; }
    }
}
