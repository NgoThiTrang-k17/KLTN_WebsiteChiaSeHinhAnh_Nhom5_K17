using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using WebApi.Entities;
using WebApi.Models.Reactions;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReactionsController : BaseController
    {
        private readonly IReactionService _reactionService;
        public ReactionsController(
             IReactionService reactionService
             )
        {
            _reactionService = reactionService;

        }
        [HttpGet("GetAll")]
        public ActionResult<IEnumerable<ReactionResponse>> GetAll()
        {
            var reactions = _reactionService.GetAll();
            return Ok(reactions);
        }
        [HttpGet("GetAllByTargetId/{targetType}/{targetId:int}")]
        public ActionResult<IEnumerable<ReactionResponse>> GetAllByTargetId(ReactionTarget targetType, int targetId)
        {
            var reactions = _reactionService.GetAllByTargetId(targetType,targetId);
            return Ok(reactions);
        }

        [HttpGet("GetState/{postId:int}")]
        public ActionResult<ReactionState> GetState(int postId)
        {

            var state = _reactionService.GetState(postId, Account.Id);
            return Ok(state);
        }

        [HttpPost]
        public ActionResult<ReactionResponse> Create(CreateReactionRequest model)
        {
            model.OwnerId = Account.Id;
            var reaction = _reactionService.CreateReaction(model);
            return Ok(reaction);
        }


        [HttpPut("{id:int}")]
        public ActionResult<ReactionResponse> Update(int id, UpdateReactionRequest model)
        {
            var reaction = _reactionService.UpdateReaction(id, model);
            return Ok(reaction);
        }

        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            _reactionService.DeleteReaction(id);
            return Ok(new { message = "Reaction deleted successfully" });
        }
        [HttpDelete("DeleteByPostId{id:int}")]
        public IActionResult DeleteByPostId(int id)
        {
            _reactionService.DeleteByPostId(id, Account.Id);
            return Ok(new { message = "Reaction deleted successfully" });
        }
    }
}
