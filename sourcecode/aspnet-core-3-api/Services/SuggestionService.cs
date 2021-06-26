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
        Task<List<string>> GetUserPreference();
        Task<List<string>> GetUserPreference(int userId);

        Task<IEnumerable<PostResponse>> GetPostByPreference(int userId);

        Task<IEnumerable<PostResponse>> GetSearchSuggestion();
        Task<IEnumerable<PostResponse>> GetSearchSuggestion(int userId);
    }
    public class SuggestionService : ISuggestionService
    {
        private readonly IReactionService _reactionService;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SuggestionService(IReactionService reactionService,
            DataContext context,
            IMapper mapper)
        {
            _reactionService = reactionService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<string>> GetUserPreference()
        {
            var userPreferences = _context.Reactions.Where(x => x.Target == ReactionTarget.Post);
            List<Categories> preferences = new List<Categories>();
            foreach (var userPreference in userPreferences)
            {
                var post = await _context.Posts.FindAsync(userPreference.TargetId);
                if (post != null)
                {
                    var postCategories = post.Categories.Split('-').ToList();
                    foreach (var postCartegory in postCategories)
                    {
                        var category = new Categories
                        {
                            Name = postCartegory,
                            Count = preferences.Count(x => x.Name == postCartegory)
                        };
                        preferences.Add(category);
                    }
                }
            }
            var result = preferences.OrderByDescending(x => x.Count).Take(10).Select(x => x.Name).ToList();
            return result;
        }
        public async Task<List<string>> GetUserPreference(int userId)
        {
            var userPreferences = _context.Reactions.Where(x => x.Target == ReactionTarget.Post && x.OwnerId == userId);
            List<Categories> preferences = new List<Categories>();
            foreach (var userPreference in userPreferences)
            {
                var post = await _context.Posts.FindAsync(userPreference.TargetId);
                if (post != null)
                {
                    var postCategories = post.Categories.Split('-').ToList();

                    foreach (var postCartegory in postCategories)
                    {
                        var category = new Categories
                        {
                            Name = postCartegory,
                            Count = preferences.Count(x => x.Name == postCartegory)
                        };
                        preferences.Add(category);
                    }
                }
            }
            var result = preferences.OrderByDescending(x => x.Count).Take(10).Select(x => x.Name).ToList();
            return result;
        }

        public async Task<IEnumerable<PostResponse>> GetPostByPreference(int userId)
        {
            var userPreference = await GetUserPreference(userId);
            var posts = _context.Posts;
            var responses = new List<Post>();
            foreach (var post in posts)
            {
                var postCategories = post.Categories.Split('-').ToList();
                var suitable = postCategories.Intersect(userPreference).Any();
                if (suitable)
                {
                    responses.Add(post);
                }
            }

            return _mapper.Map<IEnumerable<PostResponse>>(responses);
        }

        public async Task<IEnumerable<PostResponse>> GetSearchSuggestion()
        {
            var userPreferences = await GetUserPreference();

            var responses = new List<Post>();
            foreach (var userPreference in userPreferences)
            {
                var post = _context.Posts.Where(x => x.Categories.StartsWith(userPreference)).FirstOrDefault();
                if (post != null)
                {
                    responses.Add(post);
                }
            }

            return _mapper.Map<IEnumerable<PostResponse>>(responses);
        }
        public async Task<IEnumerable<PostResponse>> GetSearchSuggestion(int userId)
        {
            var userPreferences = await GetUserPreference(userId);

            var responses = new List<Post>();
            foreach (var userPreference in userPreferences)
            {
                var post = _context.Posts.Where(x => x.Categories.StartsWith(userPreference)).FirstOrDefault();
                if (post != null)
                {
                    responses.Add(post);
                }
            }

            return _mapper.Map<IEnumerable<PostResponse>>(responses);
        }
    }
}
