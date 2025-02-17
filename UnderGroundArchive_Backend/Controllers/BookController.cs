using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.DTO;
using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly UGA_DBContext _dbContext;

        public BookController( UGA_DBContext dBContext)
        {
            _dbContext = dBContext;
        }

        //Book endpoints

        [HttpGet("books")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            var books = await _dbContext.Books
                .Include(c => c.Comments)
                .Include(r => r.ReaderRatings)
                .Include(cr => cr.CriticRatings)
                .Select(b => new BookDTO
                {
                    Id = b.BookId,
                    BookName = b.BookName,
                    GenreId = b.GenreId,
                    CategoryId = b.CategoryId,
                    BookDescription = b.BookDescription,
                    Comments = b.Comments.Select(c => new CommentDTO { CommentMessage = c.CommentMessage }).ToList(),
                    ReaderRatings = b.ReaderRatings.Select(r => new ReaderRatingDTO { RatingValue = r.RatingValue }).ToList(),
                    CriticRatings = b.CriticRatings.Select(cr => new CriticRatingDTO { RatingValue = cr.RatingValue }).ToList(),
                    AverageRating = b.ReaderRatings.Any() ? b.ReaderRatings.Average(r => r.RatingValue) : 0,
                    AuthorId = b.AuthorId
                })
                .ToListAsync();

            return Ok(books);
        }

        [HttpGet("book/{id}")]
        public async Task<ActionResult<Books>> GetBook(int id)
        {
            var book = await _dbContext.Books.Include(c => c.Comments).Include(r => r.ReaderRatings).Include(cr => cr.CriticRatings).FirstOrDefaultAsync(c => c.BookId == id);
            return book == null ? NotFound() : book;
        }

        //get chapter endpoints

        [HttpGet("chapters/{bookId}")]
        public async Task<IActionResult> GetChaptersByBook(int bookId)
        {
            var chapters = await _dbContext.Chapters
                .Where(c => c.BookId == bookId)
                .OrderBy(c => c.ChapterNumber)
                .ToListAsync();

            if (chapters == null) return NotFound();

            return Ok(chapters);
        }

        [HttpGet("chapter/{bookId}/{chapterNumber}")]
        public async Task<IActionResult> GetSpecificChapter(int bookId, int chapterNumber)
        {
            var chapter = await _dbContext.Chapters
                .Where(c => c.BookId == bookId && c.ChapterNumber == chapterNumber)
                .FirstOrDefaultAsync();

            if (chapter == null) return NotFound();

            return Ok(chapter);
        }
    }
}
