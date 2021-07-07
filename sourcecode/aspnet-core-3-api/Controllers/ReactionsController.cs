using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<IEnumerable<ReactionResponse>>> GetAll()
        {
            var reactions = await _reactionService.GetAll();
            return Ok(reactions);
        }

        [HttpGet("GetAllByTargetId/{targetType}/{targetId:int}")]
        public async Task<ActionResult<IEnumerable<ReactionResponse>>> GetAllByTargetId(ReactionTarget targetType, int targetId)
        {
            var reactions = await _reactionService.GetAllByTargetId(targetType, targetId);
            
            return Ok(reactions);
        }

        [HttpGet("GetState/{targetType}/{targetId:int}")]
        public async Task<ActionResult<ReactionState>> GetState(ReactionTarget targetType, int targetId)
        {
            var state = await _reactionService.GetState(targetType, targetId, Account.Id);
            return Ok(state);
        }

        [HttpPost]
        public async Task<ActionResult<ReactionResponse>> Create(CreateReactionRequest model)
        {
            model.OwnerId = Account.Id;
            var reaction = await _reactionService.CreateReaction(model);
            return Ok(reaction);
        }


        [HttpPut("{id:int}")]
        public async Task<ActionResult<ReactionResponse>> Update(int id, UpdateReactionRequest model)
        {
            var reaction = await _reactionService.UpdateReaction(id, model);
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

        [HttpDelete("DeleteByCommentId{id:int}")]
        public IActionResult DeleteByCommentId(int id)
        {
            _reactionService.DeleteByCommentId(id, Account.Id);
            return Ok(new { message = "Reaction deleted successfully" });
        }
    }
}
