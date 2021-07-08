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
        private readonly IPostService _postService;
        private readonly ISuggestionService _suggestionService;
        private readonly IReactionService _reactionService;

        public PostsController(
            IPostService postService, 
            ISuggestionService suggestionService,
            IReactionService reactionService)
        {
            _postService = postService;
            _suggestionService = suggestionService;
            _reactionService = reactionService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostResponse>>> GetAll()
        {
            var posts = await _postService.GetAll();
            foreach (PostResponse post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);

        }

        [HttpGet("GetSuggestion")]
        public async Task<ActionResult<IEnumerable<PostResponse>>> GetSuggestion()
        {
            var posts = await _suggestionService.GetSearchSuggestion();
            foreach (PostResponse post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);
        }

        [HttpGet("GetSuggestion/{id:int}")]
        public async Task<ActionResult<IEnumerable<PostResponse>>> GetSuggestion(int id)
        {
            var posts = await _suggestionService.GetSearchSuggestion(id);
            foreach (PostResponse post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);
        }

        [HttpGet("GetByPreference/{id:int}")]
        public async Task<ActionResult<IEnumerable<PostResponse>>> GetByPreference(int id)
        {
            var posts = await _suggestionService.GetPostByPreference(id);
            foreach (PostResponse post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PostResponse>> GetById(int id)
        {
            var post = await _postService.GetById(id);
            var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
            post.IsReactedByThisUser = reactionState.IsReactedByThisUser;

            return Ok(post);
        }

        [HttpGet("User/{id:int}")]
        public async Task<ActionResult<IEnumerable<PostResponse>>> GetByUser(int id)
        {
            var posts = await _postService.GetByOwnerId(id);
            foreach (PostResponse post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);
        }

        private string GetImageTags(string imageUrl)
        {
            //Hosted web API REST Service base url  

            string apiKey = "acc_0f6c245c9850af0";
            string apiSecret = "8e6427e8172eee4a8a6c260c6f71e32a";
             

            string basicAuthValue = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(String.Format("{0}:{1}", apiKey, apiSecret)));

            var client = new RestClient("https://api.imagga.com/v2/tags");
            client.Timeout = -1;

            var request = new RestRequest(Method.GET);
            request.AddParameter("image_url", imageUrl);
            //request.AddParameter("limit", 10);
            request.AddParameter("language", "vi");
            request.AddParameter("threshold", 30.0);
            request.AddHeader("Authorization", String.Format("Basic {0}", basicAuthValue));

            IRestResponse response = client.Execute(request);
            CategorizerResult myDeserializedClass = JsonConvert.DeserializeObject<CategorizerResult>(response.Content);
            if(myDeserializedClass.Result.Tags.Count == 0)
            {
                var secondRequest = new RestRequest(Method.GET);
                secondRequest.AddParameter("image_url", imageUrl);
                secondRequest.AddParameter("language", "vi");
                secondRequest.AddParameter("limit", 10);
                secondRequest.AddHeader("Authorization", String.Format("Basic {0}", basicAuthValue));
                response = client.Execute(secondRequest);
            }
            myDeserializedClass = JsonConvert.DeserializeObject<CategorizerResult>(response.Content);
            var a = new List<string>();
            foreach (var tag in myDeserializedClass.Result.Tags)
            {
                a.Add(tag.Tag.Vi);
            }
            var categories = String.Join('-', a);
            return categories;
        }

        [HttpGet("Tags")]
        public IActionResult GetTags(string imageUrl)
        {
            //Hosted web API REST Service base url  

            string apiKey = "acc_0f6c245c9850af0";
            string apiSecret = "8e6427e8172eee4a8a6c260c6f71e32a";

            string basicAuthValue = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(String.Format("{0}:{1}", apiKey, apiSecret)));

            var client = new RestClient("https://api.imagga.com/v2/tags");
            client.Timeout = -1;

            var request = new RestRequest(Method.GET);
            request.AddParameter("image_url", imageUrl);
            request.AddParameter("language", "vi");
            request.AddParameter("threshold", 30.0);
            request.AddHeader("Authorization", String.Format("Basic {0}", basicAuthValue));
            IRestResponse response = client.Execute(request);

            CategorizerResult myDeserializedClass = JsonConvert.DeserializeObject<CategorizerResult>(response.Content);
            if (myDeserializedClass.Result.Tags.Count == 0)
            {
                var secondRequest = new RestRequest(Method.GET);
                secondRequest.AddParameter("image_url", imageUrl);
                request.AddParameter("language", "vi");
                secondRequest.AddParameter("threshold", 10.0);
                secondRequest.AddHeader("Authorization", String.Format("Basic {0}", basicAuthValue));
                response = client.Execute(secondRequest);
            }
            myDeserializedClass = JsonConvert.DeserializeObject<CategorizerResult>(response.Content);
            var a = new List<string>();
            foreach (var tag in myDeserializedClass.Result.Tags)
            {
                a.Add(tag.Tag.Vi);
            }
            var categories = String.Join('-', a);
            return Ok(categories);
        }

        [HttpPut("UpdateTags")]
        public async Task<IActionResult> UpdateTags()
        {
            var posts = await _postService.GetAll();
            foreach(var post in posts)
            {
                UpdatePostRequest request = new UpdatePostRequest
                {
                    Categories = GetImageTags(post.Path)
                };
                await _postService.UpdatePost(post.Id,request);
            }
            return Ok(posts);
        }

        [HttpPost("Share")]
        public IActionResult Share(int id)
        {
            _postService.Share(id);
            return Ok(new { message = "Post shared"});
        } 

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Create([FromForm] CreatePostRequest model)
        {
            try
            { 
                model.Created = DateTime.Now;
                model.OwnerId = Account.Id;
                model.Categories = GetImageTags(model.Path);
                var post = await _postService.CreatePost(model);
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
        public async Task<ActionResult<PostResponse>> Update(int id, UpdatePostRequest model)
        {

            var post  = await _postService.UpdatePost(id, model);

            return Ok(post);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _postService.DeletePost(id);
            return Ok(new { message = "Post deleted successfully" });


        }
    }
}
