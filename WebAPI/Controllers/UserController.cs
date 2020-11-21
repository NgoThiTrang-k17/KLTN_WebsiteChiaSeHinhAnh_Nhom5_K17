using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await dc.Users.ToListAsync();
            return Ok(users);
        }
        [HttpGet("{id}")] //GET api/user/id
        public async Task<IActionResult> GetUser(int id)
        {
            var user = dc.Users.Where(r => r.Id == id);
            return Ok(user);
        }

        //POST api/user/add?FirstName=value&Lastname=&Avatar=value&Email=value&Region=value&Gender=value&Self_introduce=value
        [HttpPost("add")] 
        public async Task<IActionResult> AddUser(string FirstName,string Lastname,int Avatar,string Email,string Region,int Gender,string Self_introduce)
        {
            User user = new User
            {
                FirstName = FirstName,
                Lastname = Lastname,
                Avatar = Avatar,
                Email = Email,
                Region = Region,
                Gender = Gender,
                Self_introduce = Self_introduce
            };
            await dc.Users.AddAsync(user);
            await dc.SaveChangesAsync();
            return Ok(user);
        }
        
        //POST api/user/addUser
        [HttpPost("addUser")] 
        public async Task<IActionResult> AddUser1(User user)
        {
            await dc.Users.AddAsync(user);
            await dc.SaveChangesAsync();
            return Ok(user);
        }

        //POST api/user/delete/value
        [HttpDelete("delete/{id}")] 
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await dc.Users.FindAsync(id);
            dc.Users.Remove(user);
            await dc.SaveChangesAsync();
            return Ok(id);
        }

    }
}
