using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Entities
{
    public class AppUserPreference
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PostId { get; set; }
    }

    public class Categories
    {
        public string Name { get; set; }

        public int Count { get; set; }

    }
}
