namespace WebApi.Models.Posts
{
    
    public class PostResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Path { get; set; }   
        public int OwnerId {get; set;}
    }
}