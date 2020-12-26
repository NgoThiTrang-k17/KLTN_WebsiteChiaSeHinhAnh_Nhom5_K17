using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
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

        public PostsController(
            IWebHostEnvironment webHostEnvironment,
            IPostService postService
            )
        {
            _webHostEnvironment = webHostEnvironment;
            _postService = postService;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            return Ok(posts);

        }

        [HttpGet("GetPostById/{id:int}")]
        public ActionResult<PostResponse> GetPostById(int id)
        {
            var post = _postService.GetPostById(id);
            return Ok(post);
        }

        [HttpGet("GetAllByUserId/{id:int}")]
        public ActionResult<IEnumerable<PostResponse>> GetAllByUserId(int id)
        {
            var posts = _postService.GetAllByUserId(id);
            return Ok(posts);
        }
  

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult CreatePost([FromForm] CreatePostRequest post)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    var model = new CreatePostRequest
                    {
                        PostTitle = post.PostTitle,
                        Created = DateTime.Now,
                        ImagePath = dbPath,
                        OwnerId = Account.Id,
                    };

                    var temp = _postService.CreatePost(model);

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
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

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            _postService.DeletePost(id);
            return Ok(new { message = "Post deleted successfully" });


        }


    }
}
