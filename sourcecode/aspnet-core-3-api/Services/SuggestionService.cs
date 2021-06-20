using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Posts;

namespace WebApi.Services
{
    public interface ISuggestionService
    {
        Task<List<string>> GetUserPreference(int userId);
        Task<IEnumerable<PostResponse>> GetPostByPreference(int userId);
    }
    public class SuggestionService : ISuggestionService
    {
        private readonly IAccountService _accountService;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SuggestionService(IAccountService accountService,
            DataContext context,
            IMapper mapper)
        {
            _accountService = accountService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<string>> GetUserPreference(int userId)
        {
            var userPreferences = _context.UserPreferences.Where(x => x.UserId == userId);
            List<Categories> preferences = new List<Categories>();
            foreach (var userPreference in userPreferences)
            {
                var post = await _context.Posts.FindAsync(userPreference.PostId);
                var postCategories = post.Categories.Split('-').ToList();
                foreach (var postCartegory in postCategories)
                {
                    var category = new Categories();
                    category.Name = postCartegory;
                    category.Count = postCategories.Count(x=>x == postCartegory);
                    preferences.Add(category);
                }
            }
            preferences.OrderByDescending(x => x.Count);
            preferences.Take(5);
            var result = new List<string>();
            foreach(var preference in preferences)
            {
                result.Add(preference.Name);
            }
            return result;
        }

        public async Task<IEnumerable<PostResponse>> GetPostByPreference(int userId)
        {
            var userPreference = await GetUserPreference(userId);
            var posts = _context.Posts;
            var respones = new List<Post>();
            foreach(var post in posts)
            {
                var postCategories = post.Categories.Split('-').ToList();
                var suitable = postCategories.Intersect(userPreference).Any();
                if (suitable)
                {
                    respones.Add(post);
                }
            }

            return  _mapper.Map<IEnumerable<PostResponse>>(respones);
        }
    }
}
