using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
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
        private readonly IReactionService _reactionService;

        public PostsController(IPostService postService,
            IReactionService reactionService)
        {
            _postService = postService;
            _reactionService = reactionService;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> GetAll()
        {
            var posts = _postService.GetAll();
            foreach (PostResponse post in posts)
            {
                post.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id).IsReactedByThisUser;
            }
            return Ok(posts);

        }

        [HttpGet("{id:int}")]
        public ActionResult<PostResponse> GetById(int id)
        {
            var post = _postService.GetById(id);

            post.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id).IsReactedByThisUser;

            return Ok(post);
        }

        [HttpGet("User/{id:int}")]
        public ActionResult<IEnumerable<PostResponse>> GetByUser(int id)
        {
            var posts = _postService.GetByOwnerId(id);
            foreach (PostResponse post in posts)
            {
                post.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id).IsReactedByThisUser;
            }
            return Ok(posts);
        }

        [HttpGet("Tags")]
        public IActionResult GetImageTags(string imageUrl, string authorizeKey)
        {
            //Hosted web API REST Service base url  

            var client = new RestClient("https://api.imagga.com/v2/tags?image_url=" + imageUrl);
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            //request.AddParameter

            request.AddHeader("Authorization", authorizeKey);
            request.AddParameter("text/plain", "", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            return Ok(response.Content);
        }

        [HttpPost("Share")]
        public IActionResult Share(int id)
        {
            _postService.Share(id);
            return Ok(new { message = "Post shared"});
        }
        //[HttpGet("DownloadImage/{id:int}")]
        //public IActionResult DownloadImage(int id)
        //{
        //    var fileName = _postService.GetById(id).ImageName;

        //    var folderName = Path.Combine("Resources", "Images");
        //    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        //    var filePath = Path.Combine(pathToSave, fileName);

        //    return PhysicalFile(filePath, "image/jpeg");
        //}

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult Create([FromForm] CreatePostRequest model)
        {
            try
            {
                //var file = Request.Form.Files[0];
                //var folderName = Path.Combine("Resources", "Images");
                //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                //if (file.Length > 0)
                //{
                //var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                //var fileName = string.Format(@"{0}.jpg", Guid.NewGuid());
                //var fullPath = Path.Combine(pathToSave, fileName);
                //var dbPath = Path.Combine(folderName, fileName);

                //using (var stream = new FileStream(fullPath, FileMode.Create))
                //{
                //    file.CopyTo(stream);
                //}
                //var model = new CreatePostRequest
                //{
                //    Title = post.Title,
                //    Created = DateTime.Now,
                //    //ImageName = fileName,
                //    Path = dbPath,
                //    OwnerId = Account.Id,
                //};
                model.Created = DateTime.Now;
                model.OwnerId = Account.Id;
                var post = _postService.Create(model);
                return Ok(post);
                //}
                //else
                //{
                //    return BadRequest();
                //}
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPut("{id:int}")]
        public ActionResult<PostResponse> Update(int id, [FromForm] UpdatePostRequest model)
        {

            var post = _postService.UpdatePost(id, model);

            return Ok(post);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            _postService.DeletePost(id);
            return Ok(new { message = "Post deleted successfully" });


        }
    }
}
