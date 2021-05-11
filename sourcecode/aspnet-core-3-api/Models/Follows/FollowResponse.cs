using WebApi.Entities;

namespace WebApi.Models.Follows
{
    public class FollowResponse
    {
        public int Id { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string SubjectAvatarPath { get; set; }
        public bool isSubject_FollowedByCurrentUser { get; set; }

        public int FollowerId { get; set; }
        public string FollowerName { get; set; }
        public string FollowerAvatarPath { get; set; }
        public bool isFollower_FollowedByCurrentUser { get; set; }

        public Status Status { get; set; }
    }
}