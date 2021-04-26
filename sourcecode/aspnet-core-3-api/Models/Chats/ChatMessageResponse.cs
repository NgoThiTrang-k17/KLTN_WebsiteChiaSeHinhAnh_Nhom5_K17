namespace WebApi.Models.Chats
{
    public class ChatMessageResponse
    {
        public string User { get; set; }
        public string Message { get; set; }
        public int UserId { get; set; }
    }
}