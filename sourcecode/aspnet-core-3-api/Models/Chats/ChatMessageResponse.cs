using System;

namespace WebApi.Models.Chats
{
    public class ChatMessageResponse
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public int ChatRoomId { get; set; }
        public DateTime Created { get; set; }
    }
}