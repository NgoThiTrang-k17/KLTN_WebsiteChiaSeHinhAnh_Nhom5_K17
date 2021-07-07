
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;
using WebApi.Models.Accounts;
using WebApi.Models.Posts;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : BaseController
    {
        private readonly IReactionService _reactionService;
        private readonly ISearchService _searchService;

        public SearchController(
            IReactionService reactionService,
            ISearchService searchService)
        {
            _reactionService = reactionService;
            _searchService = searchService;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostResponse>>> Search(string query)
        {

            if (query.StartsWith('@'))
            {
                query = query.Substring(1);
                var posts = await _searchService.SearchForAccounts(Account.Id, query);
               
                return Ok(posts);
            }
            else
            {
                var posts = await _searchService.SearchForPosts(Account.Id, query);
                foreach (var post in posts)
                {
                    var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                    post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
                }
                return Ok(posts);
            }

        }

        [HttpGet("SearchForMessage")]
        public async Task<ActionResult<IEnumerable<AccountResponse>>> SearchForMessage(string query)
        {
            var accounts = await _searchService.SearchForAccounts(Account.Id, query);
            return Ok(accounts);
        }

        [HttpGet("SearchByCategories")]
        public async Task<ActionResult<IEnumerable<AccountResponse>>> SearchByCategories(string query)
        {
            var posts =  await _searchService.SearchByCategories(Account.Id, query);
            foreach (var post in posts)
            {
                var reactionState = await _reactionService.GetState(ReactionTarget.Post, post.Id, Account.Id);
                post.IsReactedByThisUser = reactionState.IsReactedByThisUser;
            }
            return Ok(posts);
        }

        [HttpGet("SearchHistory/{id:int}")]
        public async Task<ActionResult<IEnumerable<string>>> Search(int id)
        { 
            var history = await _searchService.SearchHistory(id);
            return Ok(history);
        }

    }
}
