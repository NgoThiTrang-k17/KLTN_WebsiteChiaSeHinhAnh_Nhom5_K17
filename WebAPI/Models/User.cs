using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string Lastname { get; set; }
        public string Password { get; set; }
        public int    Avatar { get; set; }
        public string Email { get; set; }
        public string Region { get; set; }
        public int    Gender { get; set; }
        public string Self_introduce { get; set; }
    }
}
