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
        private readonly AppSettings _appSettings;
        private readonly INotificationService _notificationService;
        public CommentService(DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _notificationService = notificationService;
        }
        public IEnumerable<CommentResponse> GetAll()
        {
            var comments = _context.Comment;
            return _mapper.Map<List<CommentResponse>>(comments);
        }

        public IEnumerable<CommentResponse> GetAllByPostId(int postId)
        {
            var comments = _context.Comment.Where(comment => comment.PostId == postId);
            return _mapper.Map<List<CommentResponse>>(comments);
        }

        public CommentResponse CreateComment(CreateCommentRequest model)
        {
            var comment = _mapper.Map<Comment>(model);
            _context.Comment.Add(comment);
            _context.SaveChanges();
            SendComentNotification(comment.OwnerId);
          
           
            return _mapper.Map<CommentResponse>(comment);
        }
        private void SendComentNotification(int ownerId)
        {
            var notification = new CreateNotificationRequest
            {
                ActionOwnerId = 1,
                NotificationType = NotificationType.Commented,
                PostId = 1,
                ReiceiverId = ownerId,
                Created = DateTime.Now,
                Status = Status.Created
            };
            _notificationService.AddNotification(notification);
        }

        public CommentResponse UpdateComment(int id, CommentResponse model)
        {
            var comment = GetComment(id);
            _mapper.Map(model, comment);
            _context.Comment.Update(comment);
            _context.SaveChanges();

            return _mapper.Map<CommentResponse>(comment); ;
        }

        public void DeleteComment(int id)
        {
            var comment = GetComment(id);
            _context.Remove(comment);
            _context.SaveChanges();
        }

        private Comment GetComment(int id)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Post not found");
            return comment;
        }
    }
}
