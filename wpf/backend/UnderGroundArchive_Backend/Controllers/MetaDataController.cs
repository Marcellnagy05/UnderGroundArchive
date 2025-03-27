using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetaDataController : ControllerBase
    {
        private readonly UGA_DBContext _context;

        public MetaDataController(UGA_DBContext context)
        {
            _context = context;
        }

        //Genre api's
        [HttpGet("genres")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _context.Genre.ToListAsync();
            return Ok(genres);
        }

        //Category api's

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }
    }
}
