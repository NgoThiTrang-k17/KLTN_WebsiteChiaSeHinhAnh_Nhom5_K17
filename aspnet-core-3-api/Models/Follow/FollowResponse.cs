using WebApi.Entities;

namespace WebApi.Services
{
    public class FollowResponse
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int FollowerId { get; set; }
        public Status Status { get; set; }
    }
}