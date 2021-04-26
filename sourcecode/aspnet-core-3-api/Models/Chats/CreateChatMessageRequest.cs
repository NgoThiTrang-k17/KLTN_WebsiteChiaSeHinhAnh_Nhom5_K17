namespace WebApi.Models.Chats
{
    public class CreateChatMessageRequest
    {
        public string User { get; set; }
        public string Message { get; set; }
        public string userId { get; set; }
    }
}