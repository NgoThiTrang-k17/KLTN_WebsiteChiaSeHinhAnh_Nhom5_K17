using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Follows;
using WebApi.Models.Notifications;
using WebApi.Models.Posts;

namespace WebApi.Services
{

    public interface IPostService
    {
        PostResponse GetPostById(int postId);
        PostResponse CreatePost(CreatePostRequest model);
        PostResponse UpdatePost(int id, UpdatePostRequest model);
        void DeletePost(int id);
        IEnumerable<PostResponse> GetAll();
        IEnumerable<PostResponse> GetAllByUserId(int ownerId);
    }
    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly INotificationService _notificationService;
        private readonly IFollowService _followService;
        public PostService(
            DataContext context,
            IMapper mapper,
            IAccountService accountService,
            INotificationService notificationService,
            IFollowService followService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _notificationService = notificationService;
            _followService = followService;

        }
        //Create
        public PostResponse CreatePost(CreatePostRequest model)
        {
            var post = _mapper.Map<Post>(model);
            if (post == null) throw new AppException("Create Post failed");
            _context.Posts.Add(post);
            _context.SaveChanges();
            SendNotification(post);
            return _mapper.Map<PostResponse>(post);
        }

        //Update
        public PostResponse UpdatePost(int id, UpdatePostRequest model)
        {
            var post = GetPost(id);
            if (post == null) throw new AppException("Update Post failed");
            post.PostTitle = model.Title;
           //mapper.Map(model, post);
            _context.Posts.Update(post);
            _context.SaveChanges();

            return _mapper.Map<PostResponse>(post);
        }

        //Delete
        public void DeletePost(int id)
        {
            var post = GetPost(id);
            _context.Remove(post);
            _context.SaveChanges();
        }

        //Get all posts
        public IEnumerable<PostResponse> GetAll()
        {
            var posts = _context.Posts;
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;
                postResponse.OwnerName = owner.Name;

                bool IsOwnerNameNull = owner.Name == null;
                postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

                bool path = owner.AvatarPath == null;
                postResponse.OwnerAvatar = path ? "" : owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.AccountId == owner.Id);


                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }

        //Get specific post by its Id
        public PostResponse GetPostById(int postId)
        {
            var post = GetPost(postId);
            var owner = _accountService.GetById(post.OwnerId);
            var postResponse = _mapper.Map<PostResponse>(post);
            bool IsOwnerNameNull = owner.Name == null;
            postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

            bool IsAvatarPathNull = owner.AvatarPath == null;
            postResponse.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

            postResponse.FollowerCount = _context.Follows.Count(f => f.AccountId == owner.Id);


            (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            return postResponse;
        }

        //Get posts for each user
        public IEnumerable<PostResponse> GetAllByUserId(int ownerId)
        {
            var posts = _context.Posts.Where(post => post.OwnerId == ownerId);
            var postResponses = _mapper.Map<IList<PostResponse>>(posts);
            foreach (PostResponse postResponse in postResponses)
            {
                var owner = _accountService.GetById(postResponse.OwnerId);
                postResponse.OwnerId = owner.Id;

                bool IsOwnerNameNull = owner.Name == null;
                postResponse.OwnerName = IsOwnerNameNull ? "" : owner.Name;

                bool IsAvatarPathNull = owner.AvatarPath == null;
                postResponse.OwnerAvatar = IsAvatarPathNull ? "" : owner.AvatarPath;

                postResponse.FollowerCount = _context.Follows.Count(f => f.AccountId == owner.Id);

                (postResponse.CommentCount, postResponse.ReactionCount) = GetPostInfor(postResponse.Id);
            }
            return postResponses;
        }
        //helper
        private Post GetPost(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");
            return post;
        }

        //Create Notification for posting
        private void SendNotification(Post post)
        {
            var follows = _followService.GetAllByUserId(post.OwnerId);
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
                _notificationService.CreateNotification(notification);
            }
        }

        private (int, int) GetPostInfor(int id)
        {
            var commentcount = _context.Comments.Count(c => c.PostId == id);
            var reactioncount = _context.Reactions.Count(r => r.PostId == id);
            return (commentcount, reactioncount);
        }
    }
}
