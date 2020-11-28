using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using WebAPI.Data;
using WebAPI.Entities;
using WebAPI.Helpers;
using WebAPI.Models;
using WebAPI.Models.Users;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    //public class UserController : ControllerBase
    //{
    //    private readonly DataContext dc;

    //    public UserController(DataContext dc)
    //    {
    //        this.dc = dc;
    //    }

    //    [HttpGet] //GET api/user
    //    public async Task<IActionResult> GetUsers()
    //    {
    //        var users = await dc.Users.ToListAsync();
    //        return Ok(users);
    //    }


    //    //POST api/user/add?FirstName=value&Lastname=&Avatar=value&Email=value&Region=value&Gender=value&Self_introduce=value
    //    [HttpPost("add")]
    //    public async Task<IActionResult> AddUser(string FirstName, string Lastname, string Password, int Avatar, string Email, string Region, int Gender, string Self_introduce)
    //    {
    //        User user = new User
    //        {
    //            //FirstName = FirstName,
    //            //Lastname = Lastname,
    //            //Password = Password,
    //            //Avatar = Avatar,
    //            //Email = Email,
    //            //Region = Region,
    //            //Gender = Gender,
    //            //Self_introduce = Self_introduce
    //        };
    //        await dc.Users.AddAsync(user);
    //        await dc.SaveChangesAsync();
    //        return Ok(user);
    //    }

    //    //POST api/user/registerUser
    //    [HttpPost("registerUser")]
    //    public async Task<IActionResult> AddUser1(User user)
    //    {
    //        await dc.Users.AddAsync(user);
    //        await dc.SaveChangesAsync();
    //        return Ok(user);
    //    }

    //    //GET api/user/getPassword/value
    //    [HttpGet("getPassword/{email}")]
    //    public async Task<IActionResult> GetUserPassword()
    //    {
    //        //var user = dc.Users.Where(r => r.PasswordHash == email);
    //        var user = new User();
    //        return Ok(user);
    //    }

    //    //POST api/user/delete/value
    //    [HttpDelete("delete/{id}")] 
    //    public async Task<IActionResult> DeleteUser(int id)
    //    {
    //        var user = await dc.Users.FindAsync(id);
    //        dc.Users.Remove(user);
    //        await dc.SaveChangesAsync();
    //        return Ok(id);
    //    }

    //}
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateModel model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info and authentication token
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            // map model to entity
            var user = _mapper.Map<User>(model);

            try
            {
                // create user
                _userService.Create(user, model.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            var model = _mapper.Map<IList<UserModel>>(users);
            return Ok(model);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);
            var model = _mapper.Map<UserModel>(user);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateModel model)
        {
            // map model to entity and set id
            var user = _mapper.Map<User>(model);
            user.Id = id;

            try
            {
                // update user 
                _userService.Update(user, model.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.Delete(id);
            return Ok();
        }
    }
}
