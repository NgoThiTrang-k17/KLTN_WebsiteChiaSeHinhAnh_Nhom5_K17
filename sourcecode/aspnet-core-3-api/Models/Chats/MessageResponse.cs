using System;

namespace WebApi.Models.Chats
{
    public class MessageResponse
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public string SenderName { get; set; }

        public string SenderAvatarPath { get; set; }

        //public int ChatRoomId { get; set; }

        public int RecipientId { get; set; }

        public string RecipientName { get; set; }

        public string RecipientAvatarPath { get; set; }

        public string Content { get; set; }

        public DateTime Created { get; set; } 

        public DateTime? Read { get; set; }

        public bool SenderDeleted { get; set; }

        public bool RecipientDeleted { get; set; }
    }
}