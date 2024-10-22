using System.ComponentModel.DataAnnotations;
using WebApi.Entities;

namespace WebApi.Models.Accounts
{
    public class CreateAccountRequest
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EnumDataType(typeof(UserRole))]
        public string Role { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}