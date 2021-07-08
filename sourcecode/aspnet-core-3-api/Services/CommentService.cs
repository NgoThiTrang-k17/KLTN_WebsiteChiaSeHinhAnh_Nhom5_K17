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
using WebApi.Models.Comments;
using WebApi.Models.Notifications;

namespace WebApi.Services
{
    public interface ICommentService
    {
        Task<CommentResponse> GetById(int id);
        Task<IEnumerable<CommentResponse>> GetAll();
        Task<IEnumerable<CommentResponse>> GetByPost(int postId);
        Task<IEnumerable<CommentResponse>> GetByComment(int commentId);
        Task<IEnumerable<CommentResponse>> GetByParent(int parentId);
        Task<CommentResponse> CreateComment(CreateCommentRequest model);
        Task<CommentResponse> UpdateComment(int id, UpdateCommentRequest model);
        Task DeleteComment(int id);
       
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
        public async Task<CommentResponse> CreateComment(CreateCommentRequest model)
        {
            var comment = _mapper.Map<Comment>(model);
            if (comment == null) throw new AppException("Create comment failed");
            //Get post by postId then map it to new Post model
            var postrespone = await _postService.GetById(model.PostId);
            var post = _mapper.Map<Post>(postrespone);
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            await SendNotification(comment.OwnerId, post);
            return _mapper.Map<CommentResponse>(comment);
        }
        
        //Update
        public async Task<CommentResponse> UpdateComment(int id, UpdateCommentRequest model)
        {
            var comment = await GetComment(id);
            if (comment == null) throw new AppException("Update comment failed");
            //comment.Content = model.Content;
            _mapper.Map(model, comment);
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();

            return _mapper.Map<CommentResponse>(comment); ;
        }

        //Delete
        public async Task DeleteComment(int id)
        {
            var comment = await GetComment(id);

            var childComments = await _context.Comments.Where(c => c.ParrentId == id).ToListAsync();
            foreach(var childComment in childComments)
            {
                var childNotifications = await _context.Notifications.Where(noti => noti.NotificationType == NotificationType.Commented && noti.PostId == childComment.PostId).ToListAsync();
                _context.RemoveRange(childNotifications);

                var childReactions = await _context.Reactions.Where(reaction => reaction.Target == ReactionTarget.Comment && reaction.TargetId == childComment.Id).ToListAsync();
                _context.RemoveRange(childReactions);

                var childReports = await _context.Reports.Where(report => report.TargetType == ReportTarget.Comment && report.TargetId == childComment.Id).ToListAsync();
                _context.RemoveRange(childReports);
            }
            _context.RemoveRange(childComments);
            //notification
            var notification = await _context.Notifications.Where(n => n.NotificationType == NotificationType.Commented && n.PostId == comment.PostId).ToListAsync();
            _context.RemoveRange(notification);
            //reaction
            var reactions = await _context.Reactions.Where(n => n.Target == ReactionTarget.Comment && n.TargetId == id).ToListAsync();
            _context.RemoveRange(reactions);
            //report
            var reports = await _context.Reports.Where(report => report.TargetType == ReportTarget.Comment && report.TargetId == id).ToListAsync();
            _context.RemoveRange(reports);

            _context.Remove(comment);
            await _context.SaveChangesAsync();
        }

        //Get all comments
        public async Task<IEnumerable<CommentResponse>> GetAll()
        {
            var comments = await _context.Comments.ToListAsync();
            return _mapper.Map<IEnumerable<CommentResponse>>(comments);
        }

        public async Task<CommentResponse> GetById(int id)
        {
            var comment = await GetComment(id);
            return _mapper.Map<CommentResponse>(comment);
        }


        //Get all comments for each post
        public async Task<IEnumerable<CommentResponse>> GetByPost(int postId)
        {
            var comments = _context.Comments.Where(comment => comment.PostId == postId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = await _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount,commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }

        //Get all comments for each comment
        public async Task<IEnumerable<CommentResponse>> GetByComment(int commentId)
        {
            var comments = _context.Comments.Where(comment => comment.ParrentId == commentId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = await _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount, commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }

        public async Task<IEnumerable<CommentResponse>> GetByParent(int parentId)
        {
            var comments = _context.Comments.Where(comment => comment.ParrentId == parentId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = await _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
                (commentResponse.ChildCount, commentResponse.ReactionCount) = GetCommentInfor(commentResponse.Id);
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }
        //helper
        private async Task<Comment> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");
            return comment;
        }

        private (int, int) GetCommentInfor(int id)
        {
            var childcount = _context.Comments.Count(c => c.ParrentId == id);
            var reactioncount = _context.Reactions.Count(r => r.TargetId == id && r.Target == ReactionTarget.Comment);
            return (childcount, reactioncount);
        }

        private async Task SendNotification(int commentOwnerId,Post model)
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
            var notification = await _notificationService.CreateNotification(createnotificationRequest);
            var connections = await _tracker.GetConnectionForUser(notification.ReiceiverId);
            if (connections != null)
            {
                await _presenceHub.Clients.Clients(connections).SendAsync("NewNotification", notification);
            }
        }
    }
}
