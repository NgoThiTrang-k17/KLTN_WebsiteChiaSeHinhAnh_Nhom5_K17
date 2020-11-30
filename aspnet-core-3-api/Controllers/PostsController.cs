using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WebApi.Entities;
using WebApi.Models.Posts;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PostsController : BaseController
    {
        private readonly IPostService _postService;
        private readonly IMapper _mapper;
 
        public PostsController(
            IPostService postService,
            IMapper mapper) {
            _postService = postService;
            _mapper = mapper;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            return Ok(posts);
        }
        [HttpPost]
        public ActionResult<PostResponse> Create (CreatePostRequest model)
        {
            var post = _postService.CreatePost(model);
            post.OwnerId = Account.Id;
            return Ok(post);
        }
    }
}
