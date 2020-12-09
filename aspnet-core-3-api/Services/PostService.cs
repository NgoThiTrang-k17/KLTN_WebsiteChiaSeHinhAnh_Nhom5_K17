using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
        PostResponse GetPostById(int postId);
        IEnumerable<PostResponse> GetAllByUserId(int ownerId);
        PostResponse CreatePost(CreatePostRequest model);
        PostResponse UpdatePost(int id, UpdatePostRequest model);
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

        public PostResponse GetPostById(int postId)
        {
            var post = GetPost(postId);
            return _mapper.Map<PostResponse>(post);
        }

        public IEnumerable<PostResponse> GetAllByUserId(int ownerId)
        {
            var posts = _context.Posts.Where(post => post.OwnerId == ownerId);
            return _mapper.Map<IList<PostResponse>>(posts);
        }

        public PostResponse CreatePost(CreatePostRequest model)
        {
            var post = _mapper.Map<Post>(model);
            _context.Posts.Add(post);
            _context.SaveChanges();
            return _mapper.Map<PostResponse>(post);
        }
        public PostResponse UpdatePost(int id, UpdatePostRequest model) 
        {
            var post = GetPost(id);
            _mapper.Map(model, post);
            _context.Posts.Update(post);
            _context.SaveChanges();

            return _mapper.Map<PostResponse>(post);
        }
        public void DeletePost(int id)
        {
            var post = GetPost(id);
            _context.Remove(post);
            _context.SaveChanges();
        }

        //helper
        private Post GetPost(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");
            return post; 
        }

    }

}
