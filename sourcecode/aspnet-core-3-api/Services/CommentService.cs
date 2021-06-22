using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Hubs;
using WebApi.Models.Comments;
using WebApi.Models.Notifications;

namespace WebApi.Services
{
    public interface ICommentService
    {
        CommentResponse GetById(int id);
        IEnumerable<CommentResponse> GetAll();
        IEnumerable<CommentResponse> GetByPost(int postId);
        IEnumerable<CommentResponse> GetByComment(int commentId);
        IEnumerable<CommentResponse> GetByParent(int parentId);
        CommentResponse CreateComment(CreateCommentRequest model);
        CommentResponse UpdateComment(int id, UpdateCommentRequest model);
        void DeleteComment(int id);
       
    }
    public class CommentService : ICommentService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IPostService _postService;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;

        public CommentService(DataContext context,
            IMapper mapper,
            IAccountService accountService,
            IPostService postService,
            INotificationService notificationService,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _postService = postService;
            _notificationService = notificationService;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        //Create
        public CommentResponse CreateComment(CreateCommentRequest model)
        {
            var comment = _mapper.Map<Comment>(model);
            if (comment == null) throw new AppException("Create comment failed");
            //Get post by postId then map it to new Post model
            var postrespone = _postService.GetById(model.PostId);
            var post = _mapper.Map<Post>(postrespone);
            _context.Comments.Add(comment);
            _context.SaveChanges();
            SendNotification(comment.OwnerId, post);
            return _mapper.Map<CommentResponse>(comment);
        }
        
        //Update
        public CommentResponse UpdateComment(int id, UpdateCommentRequest model)
        {
            var comment = GetComment(id);
            if (comment == null) throw new AppException("Update comment failed");
            //comment.Content = model.Content;
            _mapper.Map(model, comment);
            _context.Comments.Update(comment);
            _context.SaveChanges();

            return _mapper.Map<CommentResponse>(comment); ;
        }

        //Delete
        public void DeleteComment(int id)
        {
            var comment = GetComment(id);
            _context.Remove(comment);
            _context.SaveChanges();
        }

        //Get all comments
        public IEnumerable<CommentResponse> GetAll()
        {
            var comments = _context.Comments;
            return _mapper.Map<List<CommentResponse>>(comments);
        }

        public CommentResponse GetById(int id)
        {
            var comment = GetComment(id);
            return _mapper.Map<CommentResponse>(comment);
        }


        //Get all comments for each post
        public IEnumerable<CommentResponse> GetByPost(int postId)
        {
            var comments = _context.Comments.Where(comment => comment.PostId == postId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount,commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }

        //Get all comments for each comment
        public IEnumerable<CommentResponse> GetByComment(int commentId)
        {
            var comments = _context.Comments.Where(comment => comment.ParrentId == commentId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount, commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }

        public IEnumerable<CommentResponse> GetByParent(int parentId)
        {
            var comments = _context.Comments.Where(comment => comment.ParrentId == parentId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount, commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }
        //helper
        private Comment GetComment(int id)
        {
            var comment = _context.Comments.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");
            return comment;
        }
        private (int, int) GetCommentInfor(int id)
        {
            var childcount = _context.Comments.Count(c => c.ParrentId == id);
            var reactioncount = _context.Reactions.Count(r => r.TargetId == id && r.Target == ReactionTarget.Comment);
            return (childcount, reactioncount);
        }

        private async void SendNotification(int commentOwnerId,Post model)
        {
            var createnotificationRequest = new CreateNotificationRequest
            {
                ActionOwnerId = commentOwnerId,
                NotificationType = NotificationType.Commented,
                PostId = model.Id,
                ReiceiverId = model.OwnerId,
                Created = DateTime.Now,
                Status = Status.Created
            };
            var notification = _notificationService.CreateNotification(createnotificationRequest);
            var connections = await _tracker.GetConnectionForUser(notification.ReiceiverId);
            if (connections != null)
            {
                await _presenceHub.Clients.Clients(connections).SendAsync("NewNotification", notification);
            }
        }
    }
}
