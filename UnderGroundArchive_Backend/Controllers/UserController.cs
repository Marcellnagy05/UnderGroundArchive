using Microsoft.AspNetCore.Mvc;
using UnderGroundArchive_Backend.Dbcontext;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Models;
using UnderGroundArchive_Backend.DTO;
using Microsoft.AspNetCore.Identity;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UGA_DBContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager, UGA_DBContext dBContext)
        {
            _dbContext = dBContext;
            _userManager = userManager;
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _dbContext.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("books")]
        public async Task<ActionResult<IEnumerable<Books>>> GetBooks()
        {
            var books = await _dbContext.Books.Include(c => c.Comments).Include(r => r.ReaderRatings).Include(cr => cr.CriticRatings).ToListAsync();
            return Ok(books);
        }


        [HttpGet("book/{id}")]
        public async Task<ActionResult<Books>> GetBook(int id)
        {
            var book = await _dbContext.Books.Include(c => c.Comments).Include(r => r.ReaderRatings).Include(cr => cr.CriticRatings).FirstOrDefaultAsync(c => c.BookId == id);
            return book == null ? NotFound() : book;
        }



        // Comment endpoints
        [HttpGet("comments")]
        public async Task<ActionResult<IEnumerable<Comments>>> GetComments()
        {


            return await _dbContext.Comments.ToListAsync();
        }

        [HttpGet("comment/{id}")]
        public async Task<ActionResult<Comments>> GetComment(int id)
        {
            var comment = await _dbContext.Comments.Include(j => j.Books).FirstOrDefaultAsync(j => j.CommentId == id);
            return comment == null ? NotFound() : comment;
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(Comments comment)
        {
            var bookExists = await _dbContext.Books.AnyAsync(k => k.BookId == comment.BookId);
            if (!bookExists)
            {
                return BadRequest("The specified Book does not exist.");
            }

            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.CommentId }, comment);
        }

    }
}
