using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Helpers;
using WebApi.Entities;
using WebApi.Models.Notifications;
using WebApi.Models.Reactions;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Services
{
    public interface IReactionService
    {
        ReactionResponse CreateReaction(CreateReactionRequest model);
        ReactionResponse UpdateReaction(int id, UpdateReactionRequest model);
        void DeleteReaction(int id);
        void DeleteByPostId(int postId, int ownerId);
        void DeleteByCommentId(int commentId, int ownerId);
        IEnumerable<ReactionResponse> GetAll();
        IEnumerable<ReactionResponse> GetAllByTargetId(ReactionTarget targetType, int targetId);
        ReactionState GetState(ReactionTarget targetType, int targetId, int ownerId);
    }
    public class ReactionService : IReactionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly PresenceTracker _tracker;
        public ReactionService(DataContext context,
            IMapper mapper, 
            INotificationService notificationService,
            IHubContext<NotificationHub> notificationHubContext,
            PresenceTracker tracker
            )
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
            _notificationHubContext = notificationHubContext;
            _tracker = tracker;
        }

        public ReactionResponse CreateReaction(CreateReactionRequest model)
        {
            var reaction = _mapper.Map<Reaction>(model);
            if (reaction == null) throw new AppException("Create reaction failed");
            reaction.Created = DateTime.Now;

            _context.Reactions.Add(reaction);
            _context.SaveChanges();
            SendNotification(reaction.OwnerId, reaction);
            return _mapper.Map<ReactionResponse>(reaction);
        }

        public ReactionResponse UpdateReaction(int id, UpdateReactionRequest model)
        {
            var reaction = getReaction(id);
            if (reaction == null) throw new AppException("Update reaction failed");
            _mapper.Map(model, reaction);
            _context.Reactions.Update(reaction);
            _context.SaveChanges();

            return _mapper.Map<ReactionResponse>(reaction); ;
        }


        public void DeleteReaction(int id)
        {
            var reaction = getReaction(id);
            _context.Remove(reaction);
            _context.SaveChanges();
        }

        public void DeleteByPostId(int postId, int ownerId)
        {
            var model = _context.Reactions.Where(reaction => reaction.Target == ReactionTarget.Post
            && reaction.TargetId == postId
            && reaction.OwnerId == ownerId);

            var reaction = getReaction(model.FirstOrDefault().Id);
            _context.Remove(reaction);
            _context.SaveChanges();
        }
        public void DeleteByCommentId(int commentId, int ownerId)
        {
            var model = _context.Reactions.Where(reaction => reaction.Target == ReactionTarget.Comment
            && reaction.TargetId == commentId
            && reaction.OwnerId == ownerId);

            var reaction = getReaction(model.FirstOrDefault().Id);
            _context.Remove(reaction);
            _context.SaveChanges();
        }


        public IEnumerable<ReactionResponse> GetAll()
        {
            var reactions = _context.Reactions;
            return _mapper.Map<List<ReactionResponse>>(reactions);
        }

        public IEnumerable<ReactionResponse> GetAllByTargetId(ReactionTarget targetType, int targetId)
        {
            var reactions = _context.Reactions.Where(reaction => reaction.Target == targetType && reaction.TargetId == targetId);
            return _mapper.Map<List<ReactionResponse>>(reactions);
        }
        public ReactionState GetState(ReactionTarget targetType, int targetId, int ownerId)
        {

            var reaction = _context.Reactions.Where(reaction =>
            reaction.Target == targetType
            && reaction.TargetId == targetId
            && reaction.OwnerId == ownerId).Count();
            var reactionState = new ReactionState
            {
                IsCreated = 0
            };
            if (reaction != 0)
            {
                reactionState.IsReactedByThisUser = true;
                reactionState.IsCreated = 1;
                return reactionState;
            }
            else

                return reactionState;
        }

        //Helper methods
        private Reaction getReaction(int id)
        {
            var reaction = _context.Reactions.Find(id);
            if (reaction == null) throw new KeyNotFoundException("Reaction not found");
            return reaction;
        }

        private async void SendNotification(int reactionOwnerId, Reaction model)
        {
            var notification = new CreateNotificationRequest
            {
                ActionOwnerId = reactionOwnerId,
                
                
                Created = DateTime.Now,
                Status = Status.Created
            };
            if (model.Target == ReactionTarget.Post)
            {
                notification.NotificationType = NotificationType.ReactedPost;
                notification.PostId = model.TargetId;
                notification.ReiceiverId = _context.Posts.Find(model.TargetId).OwnerId;
            }
            if (model.Target == ReactionTarget.Comment)
            {
                notification.NotificationType = NotificationType.ReactedComment;
                notification.CommentId = model.TargetId;
                notification.PostId = _context.Comments.Find(model.TargetId).PostId;
                notification.ReiceiverId = _context.Comments.Find(model.TargetId).OwnerId;
            }

            _notificationService.CreateNotification(notification);

            var connections = await _tracker.GetConnectionForUser(notification.ReiceiverId);
            if (connections != null)
            {
                await _notificationHubContext.Clients.Clients(connections).SendAsync("NewNotification", notification);
            }
        }
    }
}
