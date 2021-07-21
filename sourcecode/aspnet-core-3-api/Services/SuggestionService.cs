using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Extension;
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
        private readonly IAccountService _accountService;
        private readonly IPostService _postService;
        private readonly IReactionService _reactionService;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SuggestionService(
            IAccountService accountService,
            IPostService postService,
            IReactionService reactionService,
            DataContext context,
            IMapper mapper)
        {
            _accountService = accountService;
            _postService = postService;
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
            var result = preferences.OrderByDescending(x => x.Count).Select(x => x.Name).Distinct().Take(8).ToList();
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
            var result = preferences.OrderByDescending(x => x.Count).Select(x => x.Name).Distinct().Take(8).ToList();
            return result;
        }

        public async Task<IEnumerable<PostResponse>> GetPostByPreference(int userId)
        {
            var userPreference = await GetUserPreference(userId);
            var posts = await _context.Posts.Where(p=>p.Status == Status.Public).ToListAsync();
            var responses = new List<Post>();
            if (userPreference.Count < 5)
            {
                var allUserPreference = await GetUserPreference();
                userPreference.AddRange(allUserPreference);
            }
            foreach (var post in posts)
            {
                var postCategories = post.Categories.Split('-').ToList();
                var suitable = postCategories.Intersect(userPreference).Any();
                if (suitable)
                {
                    responses.Add(post);
                }
            }

            responses.Shuffle();

            var postResponses = _mapper.Map<IEnumerable<PostResponse>>(responses);
            foreach (var postResponse in postResponses)
            {
                var owner = await _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;
                postResponse.OwnerName = owner.Name;
                postResponse.OwnerName = owner.Name;
                postResponse.OwnerAvatar = owner.AvatarPath;

                postResponse.FollowerCount = await _context.Follows.CountAsync(f => f.SubjectId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = _postService.GetPostInfor(postResponse.Id);
            }

            return postResponses;
        }

        public async Task<IEnumerable<PostResponse>> GetSearchSuggestion()
        {
            var userPreferences = await GetUserPreference();

            var responses = new List<Post>();
            foreach (var userPreference in userPreferences)
            {
                var post = _context.Posts.Where(x => x.Categories.StartsWith(userPreference) && x.Status == Status.Public).FirstOrDefault();
                if (post != null)
                {
                    post.Categories = userPreference;
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
                var post = _context.Posts.Where(x => x.Categories.StartsWith(userPreference) && x.Status == Status.Public).FirstOrDefault();
                if (post != null)
                {
                    post.Categories = userPreference;
                    responses.Add(post);
                }
            }

            return _mapper.Map<IEnumerable<PostResponse>>(responses);
        }
    }
}
