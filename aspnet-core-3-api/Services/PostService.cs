using AutoMapper;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Posts;

namespace WebApi.Services
{

    public interface IPostService
    {
        IEnumerable<PostResponse> GetAll();
        PostResponse CreatePost(CreatePostRequest model);
    }
    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        public PostService(DataContext context,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _context = context;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        public IEnumerable<PostResponse> GetAll()
        {
            var posts = _context.Posts;
            return _mapper.Map<IList<PostResponse>>(posts);
        }
        public PostResponse CreatePost(CreatePostRequest model)
        {
            var post = _mapper.Map<Post>(model);
            _context.Posts.Add(post);
            _context.SaveChanges();
            return _mapper.Map<PostResponse>(post);
        }
    }

}
