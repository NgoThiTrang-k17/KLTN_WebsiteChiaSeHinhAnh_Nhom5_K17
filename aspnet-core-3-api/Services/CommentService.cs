using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Comments;

namespace WebApi.Services
{
    public interface ICommentService
    {
        IEnumerable<CommentResponse> GetAll();
        CommentResponse CreateComment(CreateCommentRequest model);
    }
    public class CommentService:ICommentService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        public CommentService(DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }
        public IEnumerable<CommentResponse> GetAll()
        {
            var comments = _context.Comment;
                return _mapper.Map<List<CommentResponse>>(comments);
        }
        public CommentResponse CreateComment(CreateCommentRequest model)
        {
            var comment = _mapper.Map<Comment>(model);
            _context.Comment.Add(comment);
            _context.SaveChanges();
            return _mapper.Map<CommentResponse>(comment);
        }
    }
}
