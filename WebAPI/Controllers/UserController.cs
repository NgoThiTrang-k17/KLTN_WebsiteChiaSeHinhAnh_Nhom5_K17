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


        //POST api/user/add?FirstName=value&Lastname=&Avatar=value&Email=value&Region=value&Gender=value&Self_introduce=value
        [HttpPost("add")]
        public async Task<IActionResult> AddUser(string FirstName, string Lastname, string Password, int Avatar, string Email, string Region, int Gender, string Self_introduce)
        {
            User user = new User
            {
                FirstName = FirstName,
                Lastname = Lastname,
                Password = Password,
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

        //POST api/user/registerUser
        [HttpPost("registerUser")]
        public async Task<IActionResult> AddUser1(User user)
        {
            await dc.Users.AddAsync(user);
            await dc.SaveChangesAsync();
            return Ok(user);
        }

        //GET api/user
        [HttpGet("getPassword/{email}")]
        public async Task<IActionResult> GetUserPassword(string email)
        {
            var user = dc.Users.Where(r => r.Email == email);
            
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
