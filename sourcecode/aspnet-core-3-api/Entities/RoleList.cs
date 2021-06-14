using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace WebApi.Entities
{
    public enum RoleList
    {
        Admin,
        User
    }
    public class AppRole : IdentityRole<int>
    {
       public ICollection<AppUserRole> UserRoles { get; set; }
    }
}