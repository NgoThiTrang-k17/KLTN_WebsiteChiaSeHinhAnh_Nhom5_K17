using WebApi.Entities;

namespace WebApi.Models.Follows
{
    public class FollowResponse
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public int FollowerId { get; set; }
        public Status Status { get; set; }
    }
}