using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace WebApi.Entities
{
    public class AppUser : IdentityUser<int>
    {
        //public int Id { get; set; }
        public string AvatarPath { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        //public string Email { get; set; }
        //public string PasswordHash { get; set; }
        public bool AcceptTerms { get; set; }
        //public UserRole Role { get; set; }
        public string VerificationToken { get; set; }
        public DateTime? Verified { get; set; }
        public bool IsVerified => Verified.HasValue || PasswordReset.HasValue;
        public string ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public DateTime? PasswordReset { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; }
        public DateTime? Updated { get; set; }
        public List<RefreshToken> RefreshTokens { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }

        public bool OwnsToken(string token) 
        {
            return this.RefreshTokens?.Find(x => x.Token == token) != null;
        }
    }
}