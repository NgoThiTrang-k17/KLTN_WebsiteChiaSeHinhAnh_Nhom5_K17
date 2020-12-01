using AutoMapper;
using Microsoft.AspNetCore.Hosting;
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
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IPostService _postService;
        private readonly IMapper _mapper;
 
        public PostsController(
            IWebHostEnvironment webHostEnvironment,
            IPostService postService,
            IMapper mapper) {
            _webHostEnvironment = webHostEnvironment;
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
        [Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<PostResponse> Update(int id, UpdatePostRequest model)
        {
            
            var post = _postService.UpdatePost(id, model);

            return Ok(post);
        }
        [HttpGet]
        private ActionResult<IEnumerable<PostResponse>> GetPath()
        {
            string path = _webHostEnvironment.ContentRootPath;
            return Ok(path);
        }

    }
}
