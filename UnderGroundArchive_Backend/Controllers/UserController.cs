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

        // ReaderRating endpoints

        [HttpGet("readerRatings")]
        public async Task<ActionResult<IEnumerable<ReaderRatings>>> GetReaderRatings()
        {


            return await _dbContext.ReaderRatings.ToListAsync();
        }

        [HttpGet("readerRating/{id}")]
        public async Task<ActionResult<ReaderRatings>> GetReaderRating(int id)
        {
            var readerRating = await _dbContext.ReaderRatings.Include(j => j.Books).FirstOrDefaultAsync(j => j.RatingId == id);
            return readerRating == null ? NotFound() : readerRating;
        }

        [HttpPost("createReaderRating")]
        public async Task<IActionResult> CreateReaderRating(ReaderRatings readerRating)
        {
            var bookExists = await _dbContext.ReaderRatings.AnyAsync(k => k.BookId == readerRating.BookId);
            if (!bookExists)
            {
                return BadRequest("The specified Book does not exist.");
            }

            _dbContext.ReaderRatings.Add(readerRating);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetReaderRating", new { id = readerRating.RatingId }, readerRating);
        }

        [HttpPut("modifyReaderRating/{id}")]
        public async Task<ActionResult> PutReaderRating(int id, ReaderRatings modifiedReaderRating)
        {
            if (id != modifiedReaderRating.RatingId)
            {
                return BadRequest();
            }
            //TODO
            //modifiedComment.ModositasIdeje = DateTime.Now;
            _dbContext.Entry(modifiedReaderRating).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteReaderRating/{id}")]
        public async Task<ActionResult> DeleteReaderRating(int id)
        {
            var readerRating = await _dbContext.ReaderRatings.FindAsync(id);
            if (readerRating == null)
            {
                return NotFound();
            }

            _dbContext.ReaderRatings.Remove(readerRating);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        // ReaderRating endpoints

        [HttpGet("criticRatings")]
        public async Task<ActionResult<IEnumerable<CriticRatings>>> GetCriticRatings()
        {


            return await _dbContext.CriticRatings.ToListAsync();
        }

        [HttpGet("criticRating/{id}")]
        public async Task<ActionResult<CriticRatings>> GetCriticRating(int id)
        {
            var criticRating = await _dbContext.CriticRatings.Include(j => j.Books).FirstOrDefaultAsync(j => j.RatingId == id);
            return criticRating == null ? NotFound() : criticRating;
        }

        [HttpPost("createCriticRating")]
        public async Task<IActionResult> CreateCriticRating(CriticRatings criticRating)
        {
            var bookExists = await _dbContext.CriticRatings.AnyAsync(k => k.BookId == criticRating.BookId);
            if (!bookExists)
            {
                return BadRequest("The specified Book does not exist.");
            }

            _dbContext.CriticRatings.Add(criticRating);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetCriticRating", new { id = criticRating.RatingId }, criticRating);
        }

        [HttpPut("modifyCriticRating/{id}")]
        public async Task<ActionResult> PutCriticRating(int id, CriticRatings modifiedCriticRating)
        {
            if (id != modifiedCriticRating.RatingId)
            {
                return BadRequest();
            }
            //TODO
            //modifiedComment.ModositasIdeje = DateTime.Now;
            _dbContext.Entry(modifiedCriticRating).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteCriticRating/{id}")]
        public async Task<ActionResult> DeleteCriticRating(int id)
        {
            var criticRating = await _dbContext.CriticRatings.FindAsync(id);
            if (criticRating == null)
            {
                return NotFound();
            }

            _dbContext.CriticRatings.Remove(criticRating);
            await _dbContext.SaveChangesAsync();
            return NoContent();
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

        [HttpPost("createComment")]
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

        [HttpPut("modifyComment/{id}")]
        public async Task<ActionResult> PutComment(int id, Comments modifiedComment)
        {
            if (id != modifiedComment.CommentId)
            {
                return BadRequest();
            }
            //TODO
            //modifiedComment.ModositasIdeje = DateTime.Now;
            _dbContext.Entry(modifiedComment).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("deleteComment/{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _dbContext.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _dbContext.Comments.Remove(comment);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

    }
}
