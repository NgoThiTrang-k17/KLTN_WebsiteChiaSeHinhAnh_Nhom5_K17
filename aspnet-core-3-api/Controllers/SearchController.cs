
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
using WebApi.Models.Posts;
using WebApi.Services;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _searchService;
        //private readonly IElasticClient _elasticClient;
       // private readonly IOptionsSnapshot<ProductSettings> _settings;
        //private readonly ILogger _logger;

        public SearchController(
            ISearchService searchService)
        {
            _searchService = searchService;
        }
        [HttpGet]
        public ActionResult<IEnumerable<PostResponse>> Search(string query)
        {

            if (query.StartsWith('@'))
            {
                query = query.Substring(1);
                var posts = _searchService.SearchForAccounts(query);
                return Ok(posts);
            }
            else
            {
                var posts = _searchService.SearchForPosts(query);
                return Ok(posts);
            }

        }
        //[HttpGet("find")]
        //public ActionResult<IEnumerable<PostResponse>> Find(string query)
        //{
        //    var response =  _elasticClient.Search<Post>(
        //         s => s.Query(q => q.QueryString(d => d.Query(query))));

        //    if (!response.IsValid)
        //    {
        //        // We could handle errors here by checking response.OriginalException 
        //        //or response.ServerError properties
        //        //_logger.LogError("Failed to search documents");
        //        return StatusCode(500, $"Internal server error");
        //    }

        //    return Ok(response.Documents.ToList());
        //}

        //Only for development purpose
        //[HttpGet("reindex")]
        //public async Task<IActionResult> ReIndex()
        //{
        //    await _elasticClient.DeleteByQueryAsync<Post>(q => q.MatchAll());

        //    var allProducts =  _productService.GetAll();

        //    foreach (var product in allProducts)
        //    {
        //        await _elasticClient.IndexDocumentAsync(product);
        //    }

        //    return Ok($"{allProducts} product(s) reindexed");
        //}
    }
}
