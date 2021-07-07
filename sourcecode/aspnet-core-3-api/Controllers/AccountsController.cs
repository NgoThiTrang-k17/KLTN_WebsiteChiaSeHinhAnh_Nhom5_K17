using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.Extensions;
using WebApi.Helpers;
using WebApi.Models.Accounts;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : BaseController
    {
        private readonly IAccountService _accountService;

        public AccountsController(
            IAccountService accountService
            )
        {
            _accountService = accountService;
        }

        [HttpPost("authenticate")]
        public async Task<ActionResult<AuthenticateResponse>> Authenticate(AuthenticateRequest model)
        {

            var response = await _accountService.Authenticate(model, IpAddress());
            if (response == null)
                return BadRequest(new { message = "Some thing wrong" });
            SetTokenCookie(response.RefreshToken);
            return Ok(response);
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<AuthenticateResponse>> GoogleLogin(GoogleLoginResponse model)
        {
            //var refreshToken = Request.Cookies["refreshToken"];
            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings
            {
                // your google client ID
                Audience = new List<string>() { "436549259873-fvlvlseej8bo4d9ro7uism91nkol8vc0.apps.googleusercontent.com" }
            };

            GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(model.IdToken, settings).Result;

            //return Ok(new { AuthToken = _jwtGenerator.CreateUserAuthToken(payload.Email) });
            var response = await _accountService.GoogleLogin(payload, IpAddress(), Request.Headers["origin"]);
            SetTokenCookie(response.RefreshToken);
            return Ok(response);
        }


        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthenticateResponse>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = await _accountService.RefreshToken(refreshToken, IpAddress());
            SetTokenCookie(response.RefreshToken);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("revoke-token")]
        public async Task<IActionResult> RevokeToken(RevokeTokenRequest model)
        {
            // accept token from request body or cookie
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            // users can revoke their own tokens and admins can revoke any tokens
            if (!Account.OwnsToken(token))
                return Unauthorized(new { message = "Unauthorized" });

            await _accountService.RevokeToken(token, IpAddress());
            return Ok(new { message = "Token revoked" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest model)
        {
            var result = await _accountService.Register(model, Request.Headers["origin"]);
            if(result == null) return BadRequest(new { message = "Some thing wrong or invalid email" });
            return Ok(new { message = "Registration successful, please check your email for verification instructions" });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] VerifyEmailRequest model)
        {
            await _accountService.VerifyEmail(model.Token);
            return Ok(new { message = "Verification successful, you can now login" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
        {
            await _accountService.ForgotPassword(model, Request.Headers["origin"]);
            return Ok(new { message = "Please check your email for password reset instructions" });
        }

        [HttpPost("validate-reset-token")]
        public async Task<IActionResult> ValidateResetToken(ValidateResetTokenRequest model)
        {
            await _accountService.ValidateResetToken(model);
            return Ok(new { message = "Token is valid" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
        {
            await _accountService.ResetPassword(model);
            return Ok(new { message = "Password reset successful, you can now login" });
        }


        //[Authorize]
        [HttpPut("SetAvatar/{id:int}")]
        public async Task<ActionResult<AccountResponse>> SetAvatar(int id, string avatarPath)
        {
            // users can update their own account and admins can update any account
            //if (id != Account.Id && Account.Role != Role.Admin)
            //    return Unauthorized(new { message = "Unauthorized" });
            var account = await _accountService.SetAvatar(id, avatarPath);
            return Ok(account);
        }

        //[Authorize]
        //[HttpPut("UploadAvatar/{id:int}"), ]
        //public ActionResult<AccountResponse> UploadAvatar(UpdateAvatarRequest model)
        //{
        //    try
        //    {
        //        //var file = Request.Form.Files[0];
        //        //var folderName = Path.Combine("Resources", "Images");
        //        //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

        //        //if (file.Length > 0)
        //        //{
        //        //    //var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        //        //    var fileName = string.Format(@"{0}.jpg", Guid.NewGuid());
        //        //    var fullPath = Path.Combine(pathToSave, fileName);
        //        //    var dbPath = Path.Combine(folderName, fileName);

        //        //    using (var stream = new FileStream(fullPath, FileMode.Create))
        //        //    {
        //        //        file.CopyTo(stream);
        //        //    }

        //        //    model.AvatarPath = dbPath;

        //            var account = _accountService.SetAvatar(Account.Id, model.AvatarPath);

        //            return Ok(account);
        //        //}
        //        //else
        //        //{
        //        //    return BadRequest();
        //        //}
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex}");
        //    }
        //}


        //[Authorize(Role.Admin)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountResponse>>> GetAll(/*[FromQuery]UserParams accountParams*/)
        {
            //accountParams.CurrentUserId = Account.Id;
            //if (string.IsNullOrEmpty(accountParams.Gender))
            //{
            //    accountParams.Gender = Account.Title == "mr" ? "mrs": "mr" ;
            //}
            var accounts = await _accountService.GetAll(/*accountParams*/);
            //Response.AddPaginationHeader(accounts.CurrentPage, accounts.PageSize,accounts.TotalCount, accounts.TotalPages);
            return Ok(accounts);
        }

        
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AccountResponse>> GetById(int id)
        {
            var account = await _accountService.GetById(id);
            return Ok(account);
        }

        //[Authorize]
        [HttpPost]
        public async Task<ActionResult<AccountResponse>> Create(CreateAccountRequest model)
        {
            var account = await _accountService.Create(model);
            return Ok(account);
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<AccountResponse>> Update(int id, UpdateAccountRequest model)
        {
            // users can update their own account and admins can update any account
            if (id != Account.Id)
                return Unauthorized(new { message = "Unauthorized" });

            // only admins can update role
            //if (Account.Role != UserRole.Admin)
            //    model.Role = null;

            var account = await _accountService.Update(id, model);
            return Ok(account);
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            // users cant delete their own account and admins can delete any account
            if (id == Account.Id)
            {
                //if (Account.Role != UserRole.Admin)
                //    return Unauthorized(new { message = "Unauthorized" });
            }
            _accountService.Delete(id);
            return Ok(new { message = "Account deleted successfully" });
        }

        // helper methods

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string IpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}
