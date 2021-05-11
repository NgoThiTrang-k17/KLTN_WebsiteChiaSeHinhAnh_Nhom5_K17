using System;

namespace WebApi.Models.Chats
{
    public class CreateChatMessageRequest
    {
        
        public int OwnerId { get; set; }
        public int ChatRoomId { get; set; }
        public int ReceiverId { get; set; }
        public DateTime Created { get; set; }
    }
}