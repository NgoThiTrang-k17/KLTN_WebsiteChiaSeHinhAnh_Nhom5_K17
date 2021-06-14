using System;

namespace WebApi.Models.Chats
{
    public class CreateChatMessageRequest
    {
        
        public int SenderId { get; set; }

        //public int ChatRoomId { get; set; }

        public int RecipientId { get; set; }

        public string Content { get; set; }

        public DateTime? Read { get; set; }

        public DateTime Created { get; set; }
    }
}