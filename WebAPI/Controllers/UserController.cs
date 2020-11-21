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
        [HttpPost("add")] //POST api/user/add?FirstName=value&Lastname=&Avatar=value&Email=value&Region=value&Gender=value&Self_introduce=value
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
        //public IActionResult AddUsers(User user)
        //{
        //    try
        //    {
        //        if (user == null)
        //        {
        //            return BadRequest("Owner object is null");
        //        }
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest("Invalid model object");
        //        }

        //        dc.Users.Add(new User
        //        {

        //            FirstName = "Hiep",
        //            Lastname = "Huy",
        //            Avatar = 01,
        //            Email = "LeHuyHiep@gmail.com",
        //            Region = "NA",
        //            Gender = 0,
        //            Self_introduce = ""
        //        });
        //        dc.SaveChanges();
        //        return RedirectToAction("Index");
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}
    }
}
