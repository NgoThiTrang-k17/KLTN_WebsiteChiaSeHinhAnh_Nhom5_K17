using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Data;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DataContext dc;

        public UserController(DataContext dc)
        {
            this.dc = dc;
        }

        [HttpGet] //GET api/user
        public IActionResult GetUssers()
        {
            var users = dc.Users.ToList();
            return Ok(users);
        }
        [HttpGet("{id}")] //GET api/user/id
        public IActionResult Get(int id)
        {        
            var user = dc.Users.Where(r => r.Id == id); 
            return Ok(user);
        }
    }
}
