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
        public ActionResult<IEnumerable<CommentResponse>> GetAll()
        {
            var comments = _commentService.GetAll();
            foreach (CommentResponse comment in comments)
            {
                comment.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Comment,comment.Id,Account.Id ).IsReactedByThisUser;
            }
            return Ok(comments);
        }

        [HttpGet("{id:int}")]
        public ActionResult<CommentResponse> GetById(int id)
        {
            var comment = _commentService.GetById(id);
            comment.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id).IsReactedByThisUser;
            return Ok(comment);
        }


        [HttpGet("Post/{id:int}")]
        public ActionResult<IEnumerable<CommentResponse>> GetAllByPostId(int id)
        {
            var comments = _commentService.GetByPost(id);
            foreach (CommentResponse comment in comments)
            {
                comment.IsReactedByThisUser = _reactionService.GetState(ReactionTarget.Comment, comment.Id, Account.Id).IsReactedByThisUser;
                
            }
            return Ok(comments);
        }

        [HttpPost]
        public ActionResult<CommentResponse> Create( CreateCommentRequest comment)
        {

            comment.Created = DateTime.Now;
            comment.OwnerId = Account.Id;
            _commentService.CreateComment(comment);
            return Ok(comment);
        }

        //[Authorize]
        [HttpPut("{id:int}")]
        public ActionResult<CommentResponse> Update(int id, UpdateCommentRequest model)
        {
            var comment = _commentService.UpdateComment(id, model);
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
