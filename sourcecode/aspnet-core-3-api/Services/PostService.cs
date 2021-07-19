using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Hubs;
using WebApi.Models.Follows;
using WebApi.Models.Notifications;
using WebApi.Models.Posts;

namespace WebApi.Services
{

    public interface IPostService
    {
        Task<PostResponse> GetById(int postId);
        Task<PostResponse> CreatePost(CreatePostRequest model);
        Task<PostResponse> UpdatePost(int id, UpdatePostRequest model);
        void Share(int id);
        Task DeletePost(int id);
        Task<IEnumerable<PostResponse>> GetAll();
        Task<IEnumerable<PostResponse>> GetByOwnerId(int ownerId);
        Task<IEnumerable<PostResponse>> GetPrivatePost(int ownerId);
        Task<IEnumerable<PostResponse>> GetLikedPost(int ownerId);

        (int, int) GetPostInfor(int id);
    }
    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IFollowService _followService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;
        public PostService(
            DataContext context,
            IMapper mapper,
            IAccountService accountService,
            IFollowService followService,
            INotificationService notificationService,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker
            )
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _notificationService = notificationService;
            _followService = followService;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }
        //Create
        public async Task<PostResponse> CreatePost(CreatePostRequest model)
        {
            var post = _mapper.Map<Post>(model);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            if (model.Status == Status.Public) 
            { 
                await SendNotification(post); 
            }
            return _mapper.Map<PostResponse>(post);
        }

        //Update
        public async Task<PostResponse> UpdatePost(int id, UpdatePostRequest model)
        {
            var post = await GetPost(id);
            _mapper.Map(model, post);
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();

            return _mapper.Map<PostResponse>(post);
        }

        //Delete
        public async Task DeletePost(int id)
        {
            var post = await GetPost(id);
            _context.RemoveRange(GetComments(id));
            _context.RemoveRange(GetReactions(id));

            var reports = await _context.Reports.Where(report => report.TargetType == ReportTarget.Post && report.TargetId == id).ToListAsync();
            _context.RemoveRange(reports);

            var notifications = await _context.Notifications.Where(n => n.PostId == id).ToListAsync();
            _context.RemoveRange(notifications);

            _context.Remove(post);
            await _context.SaveChangesAsync();
        }

        //Share
        public void Share(int id)
        {
           
        }

        //Get all posts
        public async Task<IEnumerable<PostResponse>> GetAll()
        {
            var posts = await _context.Posts.ToListAsync();
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = await _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;
                postResponse.OwnerName = owner.Name;
                postResponse.OwnerName = owner.Name;
                postResponse.OwnerAvatar = owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }

        //Get specific post by its Id
        public async Task<PostResponse> GetById(int postId)
        {
            var post = await GetPost(postId);
            var owner = await _accountService.GetById(post.OwnerId);
            var response = _mapper.Map<PostResponse>(post);
            bool IsOwnerNameNull = owner.Name == null;
            response.OwnerName = IsOwnerNameNull ? "" : owner.Name;

            bool IsAvatarPathNull = owner.AvatarPath == null;
            response.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

            response.FollowerCount = owner.FollowerCount;


            (response.CommentCount, response.ReactionCount) = GetPostInfor(response.Id);
            return response;
        }

        //Get posts for each user
        public async Task<IEnumerable<PostResponse>> GetByOwnerId(int ownerId)
        {
            var posts = _context.Posts.Where(post => post.OwnerId == ownerId && post.Status == Status.Public).OrderByDescending(p =>p.Created);
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = await _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;

                bool IsOwnerNameNull = owner.Name == null;
                postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

                bool IsAvatarPathNull = owner.AvatarPath == null;
                postResponse.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }
        public async Task<IEnumerable<PostResponse>> GetPrivatePost(int ownerId)
        {
            var posts = _context.Posts.Where(post => post.OwnerId == ownerId && post.Status == Status.Private).OrderByDescending(p => p.Created);
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = await _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;

                bool IsOwnerNameNull = owner.Name == null;
                postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

                bool IsAvatarPathNull = owner.AvatarPath == null;
                postResponse.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }
        public async Task<IEnumerable<PostResponse>> GetLikedPost(int ownerId)
        {
            var reactions = _context.Reactions.Where(r => r.OwnerId == ownerId && r.Target == ReactionTarget.Post).OrderByDescending(r => r.Created);
            var posts = new List<Post>();
            foreach (var reaction in reactions)
            {
                var  post =  _context.Posts.Where(p => p.Id == reaction.TargetId && p.Status == Status.Public).FirstOrDefault();
                if(post != null)
                {
                    posts.Add(post);
                }
            }
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = await _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;

                bool IsOwnerNameNull = owner.Name == null;
                postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

                bool IsAvatarPathNull = owner.AvatarPath == null;
                postResponse.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.SubjectId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }

        //helper
        private async Task<Post> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found");
            return post;
        }

        //Create Notification for posting
        private async Task SendNotification(Post post)
        {
            var follows = await _followService.GetBySubjectId(post.OwnerId);
            //Create notification for each follower of Post owner
            foreach (FollowResponse follow in follows)
            {
                var notification = new CreateNotificationRequest
                {
                    //Post Owner
                    ActionOwnerId = post.OwnerId,
                    NotificationType = NotificationType.Posted,
                    PostId = post.Id,
                    ReiceiverId = follow.FollowerId,
                    Created = DateTime.Now,
                    Status = Status.Created
                };
                await _notificationService.CreateNotification(notification);
                var connections = await _tracker.GetConnectionForUser(notification.ReiceiverId);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewNotification", notification);
                }

            }

        }

        public (int, int) GetPostInfor(int id)
        {
            var commentcount = _context.Comments.Count(c => c.PostId == id);
            var reactioncount = _context.Reactions.Count(r => r.TargetId == id && r.Target == ReactionTarget.Post);
            return (commentcount, reactioncount);
        }

        private IEnumerable<Comment> GetComments(int id)
        {
            return _context.Comments.Where(c => c.OwnerId == id);           
        }

        private IEnumerable<Reaction> GetReactions(int id)
        {
            return _context.Reactions.Where(c => c.OwnerId == id);
        }
    }
}
