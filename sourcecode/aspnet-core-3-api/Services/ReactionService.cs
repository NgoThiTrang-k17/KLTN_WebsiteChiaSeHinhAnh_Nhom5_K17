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
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApi.Services
{
    public interface IReactionService
    {
        Task<ReactionResponse> CreateReaction(CreateReactionRequest model);
        Task<ReactionResponse> UpdateReaction(int id, UpdateReactionRequest model);
        Task DeleteReaction(int id);
        Task DeleteByPostId(int postId, int ownerId);
        Task DeleteByCommentId(int commentId, int ownerId);
        Task<IEnumerable<ReactionResponse>> GetAll();
        Task<IEnumerable<ReactionResponse>> GetAllByTargetId(ReactionTarget targetType, int targetId);
        Task<ReactionState> GetState(ReactionTarget targetType, int targetId, int ownerId);
    }
    public class ReactionService : IReactionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;
        public ReactionService(DataContext context,
            IMapper mapper, 
            INotificationService notificationService,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker
            )
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        public async Task<ReactionResponse> CreateReaction(CreateReactionRequest model)
        {
            var reaction = _mapper.Map<Reaction>(model);
            if (reaction == null) throw new AppException("Create reaction failed");
            reaction.Created = DateTime.Now;

            await _context.Reactions.AddAsync(reaction);
            await _context.SaveChangesAsync();
            await SendNotification(reaction.OwnerId, reaction);
            return _mapper.Map<ReactionResponse>(reaction);
        }

        public async Task<ReactionResponse> UpdateReaction(int id, UpdateReactionRequest model)
        {
            var reaction = await getReaction(id);
            if (reaction == null) throw new AppException("Update reaction failed");
            _mapper.Map(model, reaction);
            _context.Reactions.Update(reaction);
            await _context.SaveChangesAsync();

            return _mapper.Map<ReactionResponse>(reaction); ;
        }


        public async Task DeleteReaction(int id)
        {
            var reaction = await getReaction(id);
            _context.Remove(reaction);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteByPostId(int postId, int ownerId)
        {
            var model = await _context.Reactions.Where(reaction => reaction.Target == ReactionTarget.Post
            && reaction.TargetId == postId
            && reaction.OwnerId == ownerId).FirstOrDefaultAsync();

            var reaction = await getReaction(model.Id);
            _context.Remove(reaction);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteByCommentId(int commentId, int ownerId)
        {
            var model = await _context.Reactions.Where(reaction => reaction.Target == ReactionTarget.Comment
            && reaction.TargetId == commentId
            && reaction.OwnerId == ownerId).FirstOrDefaultAsync() ;

            var reaction = getReaction(model.Id);
            _context.Remove(reaction);
             await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<ReactionResponse>> GetAll()
        {
            var reactions = await _context.Reactions.ToListAsync();
            return _mapper.Map<List<ReactionResponse>>(reactions);
        }

        public async Task<IEnumerable<ReactionResponse>> GetAllByTargetId(ReactionTarget targetType, int targetId)
        {
            var reactions = await _context.Reactions.Where(reaction => reaction.Target == targetType && reaction.TargetId == targetId).ToListAsync();
            return _mapper.Map<List<ReactionResponse>>(reactions);
        }
        public async Task<ReactionState> GetState(ReactionTarget targetType, int targetId, int ownerId)
        {

            var reaction = await _context.Reactions.Where(reaction =>
            reaction.Target == targetType
            && reaction.TargetId == targetId
            && reaction.OwnerId == ownerId).CountAsync();
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
        private async Task<Reaction> getReaction(int id)
        {
            var reaction = await _context.Reactions.FindAsync(id);
            if (reaction == null) throw new KeyNotFoundException("Reaction not found");
            return reaction;
        }

        private async Task SendNotification(int reactionOwnerId, Reaction model)
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
                var receiver = await _context.Posts.FindAsync(model.TargetId);
                notification.ReiceiverId = receiver.OwnerId;
            }
            if (model.Target == ReactionTarget.Comment)
            {
                notification.NotificationType = NotificationType.ReactedComment;
                notification.CommentId = model.TargetId;
                var post = await _context.Comments.FindAsync(model.TargetId);
                notification.PostId = post.PostId;
                var receiver = await _context.Comments.FindAsync(model.TargetId);
                notification.ReiceiverId = receiver.OwnerId;
            }

            await _notificationService.CreateNotification(notification);

            var connections = await _tracker.GetConnectionForUser(notification.ReiceiverId);
            if (connections != null)
            {
                await _presenceHub.Clients.Clients(connections).SendAsync("NewNotification", notification);
            }
        }
    }
}
