using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class AccountChatRoom
    {
        public int AccountId { get; set; }
        public Account Account { get; set; }

        public string Nickname { get; set; }

        public int ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }


    }
}
