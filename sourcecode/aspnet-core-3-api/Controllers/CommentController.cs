using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Models.Comments;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : BaseController
    {
        private readonly ICommentService _commentService;
        private readonly IReactionService _reactionService;
        public CommentController(
            ICommentService commentService,
            IReactionService reactionService
            )
        {
            _commentService = commentService;
            _reactionService = reactionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentResponse>>> GetAll()
        {
            var comments = await _commentService.GetAll();
            foreach (CommentResponse comment in comments)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id);
                comment.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(comments);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<CommentResponse>> GetById(int id)
        {
            var comment = await _commentService.GetById(id);
            var reactionState = await _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id);
            comment.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            return Ok(comment);
        }


        [HttpGet("Post/{id:int}")]
        public async Task<ActionResult<IEnumerable<CommentResponse>>> GetAllByPostId(int id)
        {
            var comments = await _commentService.GetByPost(id);
            foreach (CommentResponse comment in comments)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id);
                comment.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(comments);
        }

        [HttpGet("Post/Comment/{id:int}")]
        public async Task<ActionResult<IEnumerable<CommentResponse>>> GetAllByCommentId(int id)
        {
            var comments = await _commentService.GetByComment(id);
            foreach (CommentResponse comment in comments)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id);
                comment.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(comments);
        }

        [HttpPost]
        public async Task<ActionResult<CommentResponse>> Create( CreateCommentRequest comment)
        {

            comment.Created = DateTime.Now;
            comment.OwnerId = Account.Id;
            await _commentService.CreateComment(comment);
            return Ok(comment);
        }

        //[Authorize]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<CommentResponse>> Update(int id, UpdateCommentRequest model)
        {
            var comment = await _commentService.UpdateComment(id, model);
            return Ok(comment);
        }

        //[Authorize]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {

            _commentService.DeleteComment(id);
            return Ok(new { message = "Comment deleted successfully" });
        }
    }
}
