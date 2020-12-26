using System;

namespace WebApi.Models.Accounts
{
    public class AccountResponse
    {
        public int Id { get; set; }
        public string AvatarPath { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }

        public int FollowerCount { get; set; }
    }
}