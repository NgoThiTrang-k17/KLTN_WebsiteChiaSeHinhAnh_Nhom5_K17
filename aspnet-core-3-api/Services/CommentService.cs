using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Comments;
using WebApi.Models.Notification;

namespace WebApi.Services
{
    public interface ICommentService
    {
        IEnumerable<CommentResponse> GetAll();
        IEnumerable<CommentResponse> GetAllByPostId(int postId);
        CommentResponse CreateComment(CreateCommentRequest model);
        CommentResponse UpdateComment(int id, CommentResponse model);
        void DeleteComment(int id);
    }
    public class CommentService : ICommentService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IPostService _postService;
        private readonly INotificationService _notificationService;
        public CommentService(DataContext context,
            IMapper mapper,
            IAccountService accountService,
            IPostService postService,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _postService = postService;
            _notificationService = notificationService;
        }

        //Create
        public CommentResponse CreateComment(CreateCommentRequest model)
        {
            var comment = _mapper.Map<Comment>(model);
            if (comment == null) throw new AppException("Create comment failed");
            //Get post by postId then map it to new Post model
            var post = _mapper.Map<Post>(_postService.GetPostById(model.PostId));
            _context.Comments.Add(comment);
            _context.SaveChanges();
            SendNotification(comment.OwnerId, post);
            return _mapper.Map<CommentResponse>(comment);
        }
        
        //Update
        public CommentResponse UpdateComment(int id, CommentResponse model)
        {
            var comment = GetComment(id);
            if (comment == null) throw new AppException("Update comment failed");
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
        
        //Get all comments for each post
        public IEnumerable<CommentResponse> GetAllByPostId(int postId)
        {
            var comments = _context.Comments.Where(comment => comment.PostId == postId);
            var commentResponses = _mapper.Map<List<CommentResponse>>(comments);
            foreach (CommentResponse commentResponse in commentResponses)
            {
                var owner = _accountService.GetById(commentResponse.OwnerId);
                commentResponse.OwnerName = owner.Name;
                commentResponse.OwnerAvatar = owner.AvatarPath;
            }
            return _mapper.Map<List<CommentResponse>>(commentResponses);
        }

        //helper
        private Comment GetComment(int id)
        {
            var comment = _context.Comments.Find(id);
            if (comment == null) throw new KeyNotFoundException("Post not found");
            return comment;
        }

        private void SendNotification(int commentOwnerId,Post model)
        {
            var notification = new CreateNotificationRequest
            {
                ActionOwnerId = commentOwnerId,
                NotificationType = NotificationType.Commented,
                PostId = model.Id,
                ReiceiverId = model.OwnerId,
                Created = DateTime.Now,
                Status = Status.Created
            };
            _notificationService.CreateNotification(notification);
        }
    }
}
