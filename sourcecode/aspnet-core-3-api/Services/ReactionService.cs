using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Helpers;
using WebApi.Entities;
using WebApi.Models.Notifications;
using WebApi.Models.Reactions;

namespace WebApi.Services
{
    public interface IReactionService
    {
        ReactionResponse CreateReaction(CreateReactionRequest model);
        ReactionResponse UpdateReaction(int id, UpdateReactionRequest model);
        void DeleteReaction(int id);
        void DeleteByPostId(int postId, int ownerId);
        IEnumerable<ReactionResponse> GetAll();
        IEnumerable<ReactionResponse> GetAllByTargetId(ReactionTarget targetType, int targetId);
        ReactionState GetState(int postId, int ownerId);
    }
    public class ReactionService : IReactionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IPostService _postService;
        private readonly INotificationService _notificationService;
        public ReactionService(DataContext context,
            IMapper mapper,
            IPostService postService,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _postService = postService;
            _notificationService = notificationService;
        }

        public ReactionResponse CreateReaction(CreateReactionRequest model)
        {
            var reaction = _mapper.Map<Reaction>(model);
            if (reaction == null) throw new AppException("Create reaction failed");
            //Get post by postId then map it to new Post model
            var post = _mapper.Map<Post>(_postService.GetById(model.TargetId));
            reaction.Created = DateTime.Now;

            _context.Reactions.Add(reaction);
            _context.SaveChanges();
            SendNotification(reaction.OwnerId, post);
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
        public ReactionState GetState(int postId, int ownerId)
        {

            var reaction = _context.Reactions.Where(reaction =>
            reaction.Target == ReactionTarget.Post
            && reaction.TargetId == postId
            && reaction.OwnerId == ownerId).Count();
            var reactionState = new ReactionState
            {
                IsCreated = 0
            };
            if (reaction != 0)
            {
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

        private void SendNotification(int reactionOwnerId, Post model)
        {
            var notification = new CreateNotificationRequest
            {
                ActionOwnerId = reactionOwnerId,
                NotificationType = NotificationType.Reacted,
                PostId = model.Id,
                ReiceiverId = model.OwnerId,
                Created = DateTime.Now,
                Status = Status.Created
            };
            _notificationService.CreateNotification(notification);
        }
    }
}
