using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Accounts;
using BC = BCrypt.Net.BCrypt;

namespace WebApi.Services
{
    public interface IAccountService
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress);
        Task<AuthenticateResponse> GoogleLogin(GoogleJsonWebSignature.Payload payload, string ipAddress, string origin);
        Task<AuthenticateResponse> RefreshToken(string token, string ipAddress);
        Task RevokeToken(string token, string ipAddress);
        Task<User> Register(RegisterRequest model, string origin);
        Task VerifyEmail(string token);
        Task ForgotPassword(ForgotPasswordRequest model, string origin);
        Task ValidateResetToken(ValidateResetTokenRequest model);
        Task ResetPassword(ResetPasswordRequest model);
        public Task<AccountResponse> SetAvatar(int id, string AvatarPath);
        IEnumerable<AccountResponse> GetAll();
        Task<PagedList<AccountResponse>> GetAll(UserParams accountParams);
        AccountResponse GetById(int id);
        AccountResponse Create(CreateAccountRequest model);
        Task<AccountResponse> Update(int id, UpdateAccountRequest model);
        void Delete(int id);
        Task<bool> SaveAllAsync();
        User getAccount(int id);
    }

    public class AccountService : IAccountService
    {
        private readonly DataContext _context;
        //private readonly UserManager<AppUser> _userManager;
        //private readonly SignInManager<AppUser> _signInManager;
        //private readonly RoleManager<AppRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;
        private readonly ITokenService _tokenService;

        public AccountService(
            DataContext context,
            //UserManager<AppUser> userManager,
            //SignInManager<AppUser> signInManager,
            //RoleManager<AppRole> roleManager,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IEmailService emailService,
            ITokenService tokenService
            )
        {
            _context = context;
            //_userManager = userManager;
            //_signInManager = signInManager;
            //_roleManager = roleManager;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _emailService = emailService;
            _tokenService = tokenService;
        }

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var account = await _context.Users.FirstOrDefaultAsync(x => x.Email == model.Email);
            if (account == null || !BC.Verify(model.Password, account.PasswordHash))
                throw new AppException("Email or password is incorrect");
            if (!account.IsVerified)
                throw new AppException("Email not verified");
            // authentication successful so generate jwt and refresh tokens
            var jwtToken = _tokenService.generateJwtToken(account);
            var refreshToken = generateRefreshToken(ipAddress);
            account.RefreshTokens.Add(refreshToken);

            // remove old refresh tokens from account
            removeOldRefreshTokens(account);

            // save changes to db
            _context.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.JwtToken = jwtToken;
            response.RefreshToken = refreshToken.Token;
            return response;
        }

        public async Task<AuthenticateResponse> GoogleLogin(GoogleJsonWebSignature.Payload payload, string ipAddress, string origin)
        {
            var account = await _context.Users.FirstOrDefaultAsync(x => x.Email == payload.Email);
            var isFirstAccount = _context.Users.Count() == 0;
            if (account == null)
            {
                // map model to new account object
                account = new User
                {
                    Email = payload.Email,
                    Name = payload.Name,
                    AvatarPath = payload.Picture,
                    // first registered account is an admin
                    Role = isFirstAccount ? UserRole.Admin : UserRole.User,
                    Created = DateTime.Now,
                    VerificationToken = randomTokenString(),
                    //UserName = "user" + Guid.NewGuid().ToString()
                // hash password
                PasswordHash = BC.HashPassword(Guid.NewGuid().ToString())
            };
                // save account
                _context.Users.Add(account);
                await _context.SaveChangesAsync();
                //var result = await _context.UserClaims.CreateAsync(account, Guid.NewGuid().ToString());
                //if (!result.Succeeded) throw new AppException("Some thing wrong");
                // send email
                sendVerificationEmail(account, origin);
            }
            if (!account.IsVerified)
                throw new AppException("Email not verified");

            // authentication successful so generate jwt and refresh tokens
            var jwtToken = _tokenService.generateJwtToken(account);
            //var jwtToken = payload.JwtId;
            var refreshToken = generateRefreshToken(ipAddress);
            account.RefreshTokens.Add(refreshToken);

            // remove old refresh tokens from account
            removeOldRefreshTokens(account);

            // save changes to db
            _context.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.JwtToken = jwtToken;
            response.RefreshToken = refreshToken.Token;
            return response;
        }

        public async Task<AuthenticateResponse> RefreshToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken(ipAddress);
            refreshToken.Revoked = DateTime.Now;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;
            account.RefreshTokens.Add(newRefreshToken);

            removeOldRefreshTokens(account);

            _context.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);

            // generate new jwt
            var jwtToken = _tokenService.generateJwtToken(account);

            var response = _mapper.Map<AuthenticateResponse>(account);
            response.JwtToken = jwtToken;
            response.RefreshToken = newRefreshToken.Token;
            return response;
        }

        public async Task RevokeToken(string token, string ipAddress)
        {
            var (refreshToken, account) = getRefreshToken(token);

            // revoke token and save
            refreshToken.Revoked = DateTime.Now;
            refreshToken.RevokedByIp = ipAddress;
            _context.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);
        }

        public async Task<User> Register(RegisterRequest model, string origin)
        {
            // validate
            if (_context.Users.Any(x => x.Email == model.Email))
            //var account = await _userManager.FindByEmailAsync(model.Email);
            //if (account != null)
            {
                // send already registered error in email to prevent account enumeration
                //sendAlreadyRegisteredEmail(model.Email, origin);
                return null;
            }

            // map model to new account object
            var account = _mapper.Map<User>(model);

            // first registered account is an admin
            var isFirstAccount = _context.Users.Count() == 0;
            account.Role = isFirstAccount ? UserRole.Admin : UserRole.User;

            account.Created = DateTime.Now;
            account.VerificationToken = randomTokenString();
            //account.UserName = "user" + Guid.NewGuid().ToString();
            //hash password
            account.PasswordHash = BC.HashPassword(model.Password);

            // save account
            _context.Users.Add(account);
            await _context.SaveChangesAsync();
            //var result = await _userManager.CreateAsync(account, model.Password);
            //if (!result.Succeeded) return null;
            //var isFirstAccount = _userManager.Users.Count();
            //if (isFirstAccount != 0)
            //{
            //    var roles = new List<AppRole>
            //    {
            //        new AppRole{Name="User"},
            //        new AppRole{Name="Admin"}
            //    };
            //    foreach (var role in roles)
            //    {
            //        await _roleManager.CreateAsync(role);
            //    }
            //    await _userManager.AddToRoleAsync(account, "Admin");
            //} else await _userManager.AddToRoleAsync(account, "Member");
            // send email
            //sendVerificationEmail(account, origin);
            return account;
        }

        public async Task VerifyEmail(string token)
        {
            var account = await _context.Users.SingleOrDefaultAsync(x => x.VerificationToken == token);
            //var account = await _userManager.Users.FirstOrDefaultAsync(x => x.VerificationToken == token);

            if (account == null) throw new AppException("Verification failed");

            account.Verified = DateTime.Now;
            account.VerificationToken = null;

            _context.Users.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);
        }

        public async Task ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var account = await _context.Users.SingleOrDefaultAsync(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) return;

            // create reset token that expires after 1 day
            account.ResetToken = randomTokenString();
            account.ResetTokenExpires = DateTime.Now.AddDays(1);

            _context.Users.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);

            // send email
            sendPasswordResetEmail(account, origin);
        }

        public async Task ValidateResetToken(ValidateResetTokenRequest model)
        {
            var account = await _context.Users.SingleOrDefaultAsync(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenExpires > DateTime.Now);

            if (account == null)
                throw new AppException("Invalid token");
        }

        public async Task ResetPassword(ResetPasswordRequest model)
        {
            var account = await _context.Users.SingleOrDefaultAsync(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenExpires > DateTime.Now);

            if (account == null)
                throw new AppException("Invalid token");

            // update password and remove reset token
            account.PasswordHash = BC.HashPassword(model.Password);
            account.PasswordReset = DateTime.Now;
            account.ResetToken = null;
            account.ResetTokenExpires = null;

            _context.Users.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);
        }

        public async Task<AccountResponse> SetAvatar(int id, string AvatarPath)
        {
            var account = getAccount(id);
            account.AvatarPath = AvatarPath;
            _context.Users.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);
            return _mapper.Map<AccountResponse>(account);
        }

        public IEnumerable<AccountResponse> GetAll()
        {
            var accounts = _context.Users;
            var accountResponses = _mapper.Map<IEnumerable<AccountResponse>>(accounts);
            
            foreach (AccountResponse accountResponse in accountResponses)
            {
                accountResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == accountResponse.Id);
                accountResponse.FollowingCount = _context.Follows.Count(f => f.FollowerId == accountResponse.Id);
            };

            return  accountResponses;
        }

        public async Task<PagedList<AccountResponse>> GetAll(UserParams accountParams)
        {
            var accounts = _context.Users;
            var accountResponses = _mapper.ProjectTo<AccountResponse>(accounts).AsNoTracking().AsQueryable();
            accountResponses = accountResponses.Where(u => u.Id != accountParams.CurrentUserId);

            accountResponses = accountResponses.Where(u => u.Title == accountParams.Gender);

            accountResponses = accountParams.OrderBy switch
            {
                "created" => accountResponses.OrderBy(u => u.Created),
                _ => accountResponses.OrderBy(u => u.LastActive)
            };

            foreach (AccountResponse accountResponse in accountResponses)
            {
                accountResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == accountResponse.Id);
                accountResponse.FollowingCount = _context.Follows.Count(f => f.FollowerId == accountResponse.Id);
            };

            return await PagedList<AccountResponse>.CreateAsync(accountResponses, accountParams.PageNumber, accountParams.PageSize);
        }

        public AccountResponse GetById(int id)
        {
            var account = getAccount(id);
            var accountResponse = _mapper.Map<AccountResponse>(account);

            accountResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == accountResponse.Id);
            accountResponse.FollowingCount = _context.Follows.Count(f => f.FollowerId == accountResponse.Id);


            return accountResponse;
        }

        public AccountResponse Create(CreateAccountRequest model)
        {
            // validate
            if (_context.Users.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already registered");

            // map model to new account object
            var account = _mapper.Map<User>(model);
            account.Created = DateTime.Now;
            account.Verified = DateTime.Now;

            // hash password
            account.PasswordHash = BC.HashPassword(model.Password);

            // save account
            _context.Users.Add(account);
            _context.SaveChanges();

            return _mapper.Map<AccountResponse>(account);
        }

        public async Task<AccountResponse> Update(int id, UpdateAccountRequest model)
        {
            var account = getAccount(id);

            // validate
            if (account.Email != model.Email && _context.Users.Any(x => x.Email == model.Email))
                throw new AppException($"Email '{model.Email}' is already taken");

            // hash password if it was entered
            if (!string.IsNullOrEmpty(model.Password))
                account.PasswordHash = BC.HashPassword(model.Password);

            // copy model to account and save
            _mapper.Map(model, account);
            account.Updated = DateTime.Now;
            _context.Users.Update(account);
            await _context.SaveChangesAsync();
            //await _userManager.UpdateAsync(account);

            return _mapper.Map<AccountResponse>(account);
        }

        public async void Delete(int id)
        {
            var account = getAccount(id);
            _context.Users.Remove(account);
            await _context.SaveChangesAsync();
            //await _userManager.DeleteAsync(account);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        // helper methods

        public User getAccount(int id)
        {
            var account = _context.Users.FirstOrDefault(u=>u.Id == id);
            if (account == null) throw new KeyNotFoundException("Account not found");
            return account;
        }

        private (RefreshToken, User) getRefreshToken(string token)
        {
            var account = _context.Users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));
            if (account == null) throw new AppException("Invalid token");
            var refreshToken = account.RefreshTokens.Single(x => x.Token == token);
            if (!refreshToken.IsActive) throw new AppException("Invalid token");
            return (refreshToken, account);
        }

        

        private RefreshToken generateRefreshToken(string ipAddress)
        {
            return new RefreshToken
            {
                Token = randomTokenString(),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now,
                CreatedByIp = ipAddress
            };
        }

        private void removeOldRefreshTokens(User account)
        {
            account.RefreshTokens.RemoveAll(x =>
                !x.IsActive &&
                x.Created.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.Now);
        }

        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[30];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private void sendVerificationEmail(User account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/Accounts/verify-email?token={account.VerificationToken}";
                message = $@"<p>Please click the below link to verify your email address:</p>
                             <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{account.VerificationToken}</code></p>";
            }

            _emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Verify Email",
                html: $@"<h4>Verify Email</h4>
                         <p>Thanks for registering!</p>
                         {message}"
            );
        }

        private void sendAlreadyRegisteredEmail(string email, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
                message = $@"<p>If you don't know your password please visit the <a href=""{origin}/Accounts/forgot-password"">forgot password</a> page.</p>";
            else
                message = "<p>If you don't know your password you can reset it via the <code>/Accounts/forgot-password</code> api route.</p>";

            _emailService.Send(
                to: email,
                subject: "Sign-up Verification API - Email Already Registered",
                html: $@"<h4>Email Already Registered</h4>
                         <p>Your email <strong>{email}</strong> is already registered.</p>
                         {message}"
            );
        }

        private void sendPasswordResetEmail(User account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/Accounts/reset-password?token={account.ResetToken}";
                message = $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                             <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                             <p><code>{account.ResetToken}</code></p>";
            }

            _emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Reset Password",
                html: $@"<h4>Reset Password Email</h4>
                         {message}"
            );
        }
    }
}
