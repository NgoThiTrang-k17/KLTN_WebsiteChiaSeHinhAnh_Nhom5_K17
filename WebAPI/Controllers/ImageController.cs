using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Data;
using WebAPI.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    //public class ImageController : ControllerBase
    //{
    //    private readonly DataContext dc;

    //    public ImageController(DataContext dc)
    //    {
    //        this.dc = dc;
    //    }
    //    // GET: api/image
    //    [HttpGet]
    //    public async Task<IActionResult> GetImages()
    //    {
    //        var Images = await dc.Images.ToListAsync();
    //        return Ok(Images);
    //    }

    //    // GET api/getImage/5
    //    [HttpGet("getImage/{id}")]
    //    public async Task<IActionResult> GetImage(int id)
    //    {
    //        var image = dc.Images.Where(r => r.Id == id);

    //        return Ok(image);
    //    }

    //    // POST api/Image/add
    //    [HttpPost("add")]
    //    public async Task<IActionResult> AddImage(Image image)
    //    {
    //        await dc.Images.AddAsync(image);
    //        await dc.SaveChangesAsync();
    //        return Ok(image);
    //    }



    //    // DELETE api/image/5
    //    [HttpDelete("{id}")]
    //    public async Task<IActionResult> DeleteImage(int id)
    //    {
    //        var image = await dc.Images.FindAsync(id);
    //        dc.Images.Remove(image);
    //        await dc.SaveChangesAsync();
    //        return Ok(id);
    //    }
    //}
}
