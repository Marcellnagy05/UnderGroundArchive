﻿using Microsoft.AspNetCore.Mvc;
using UnderGroundArchive_Backend.Dbcontext;
using Microsoft.EntityFrameworkCore;
using UnderGroundArchive_Backend.Models;
using UnderGroundArchive_Backend.DTO;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

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

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            return Ok(user);
        }

        //test:
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            // A tokenből kinyert felhasználói ID (a JWT-ban található)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return Unauthorized(); // Ha nincs ID, akkor 401-es válasz
            }

            // Felhasználó lekérése az ID alapján
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(); // Ha nincs ilyen felhasználó, akkor 404
            }

            return Ok(user); // A felhasználó adatainak visszaadása
        }


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

        // Request endpoints

        [HttpGet("requests")]
        public async Task<ActionResult<IEnumerable<Requests>>> GetRequests()
        {


            return await _dbContext.Requests.ToListAsync();
        }

        [HttpGet("request/{id}")]
        public async Task<ActionResult<Requests>> GetRequest(int id)
        {
            var request = await _dbContext.Requests.FirstOrDefaultAsync(j => j.RequestId == id);
            return request == null ? NotFound() : request;
        }

        [HttpPost("createRequest")]
        public async Task<IActionResult> CreateRequest(Requests request)
        {
            if (request.RequestType <= 0)
            {
                return BadRequest("Invalid RequestType specified.");
            }

            if (string.IsNullOrEmpty(request.RequesterId))
            {
                return BadRequest("RequesterId is required.");
            }

 
            _dbContext.Requests.Add(request);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetRequest", new { id = request.RequestId }, request);
        }

        // ReaderRating endpoints

        [HttpGet("readerRatings")]
        public async Task<ActionResult<IEnumerable<ReaderRatingDTO>>> GetReaderRatingsByUser([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("User ID is required.");
            }

            var readerRatings = await _dbContext.ReaderRatings
                .Where(r => r.RaterId == userId)
                .Select(r => new ReaderRatingDTO
                {
                    RatingId = r.RatingId,
                    BookId = r.BookId,
                    RatingValue = r.RatingValue,
                    RaterId = r.RaterId,
                    BookName = r.Books.BookName,
                    GenreId = r.Books.GenreId,
                    CategoryId = r.Books.CategoryId
                })
                .ToListAsync();

            if (!readerRatings.Any())
            {
                return NotFound("No ratings found for the given user.");
            }

            return Ok(readerRatings);
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
            // Ellenőrzés: létezik-e már értékelés a felhasználótól az adott könyvre
            var existingRating = await _dbContext.ReaderRatings
                .FirstOrDefaultAsync(r => r.BookId == readerRating.BookId && r.RaterId == readerRating.RaterId);

            if (existingRating != null)
            {
                return BadRequest("You have already rated this book. Please modify your existing rating.");
            }

            // Ha nem létezik, új értékelés mentése
            _dbContext.ReaderRatings.Add(readerRating);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction("GetReaderRating", new { id = readerRating.RatingId }, readerRating);
        }



        [HttpPut("modifyReaderRating/{id}")]
        public async Task<ActionResult> PutReaderRating(int id, ReaderRatings modifiedReaderRating)
        {
            // Ellenőrizd, hogy az ID egyezik-e
            if (id != modifiedReaderRating.RatingId)
            {
                return BadRequest("Invalid Rating ID.");
            }

            // Automatikusan frissítsük a módosítás dátumát
            modifiedReaderRating.ModifiedAt = DateTime.Now;

            _dbContext.Entry(modifiedReaderRating).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("The rating was not found.");
            }

            return NoContent();
        }


        [HttpDelete("deleteReaderRating/{bookId}")]
        public async Task<ActionResult> DeleteReaderRating(int bookId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var readerRating = await _dbContext.ReaderRatings
                .FirstOrDefaultAsync(r => r.BookId == bookId && r.RaterId == userId);
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
        public async Task<ActionResult<IEnumerable<CriticRatingDTO>>> GetCriticRatings([FromQuery] int bookId)
        {
            var criticRatings = await _dbContext.CriticRatings
                .Where(c => c.BookId == bookId) // Szűrés a könyv azonosítójára
                .Select(c => new CriticRatingDTO
                {
                    RatingId = c.RatingId,
                    BookId = c.BookId,
                    RatingValue = c.RatingValue,
                    RaterId = c.RaterId,
                    BookName = c.Books.BookName,
                    GenreId = c.Books.GenreId,
                    CategoryId = c.Books.CategoryId
                })
                .ToListAsync();

            if (!criticRatings.Any())
            {
                return NotFound("No ratings found for the given book.");
            }

            return Ok(criticRatings);
        }



        [HttpGet("criticRating/{id}")]
        public async Task<ActionResult<CriticRatings>> GetCriticRating(int id)
        {
            var criticRating = await _dbContext.CriticRatings.Include(j => j.Books).FirstOrDefaultAsync(j => j.RatingId == id);
            return criticRating == null ? NotFound() : criticRating;
        }

        [HttpPost("createCriticRating")]
        public async Task<ActionResult> CreateCriticRating(CriticRatingDTO criticRatingDTO)
        {
            if (criticRatingDTO == null || criticRatingDTO.BookId == 0)
            {
                return BadRequest("Book ID is required.");
            }

            // Ellenőrizzük, hogy a BookId létezik-e az adatbázisban
            var book = await _dbContext.Books.FindAsync(criticRatingDTO.BookId);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            var criticRating = new CriticRatings
            {
                BookId = criticRatingDTO.BookId,
                RatingValue = criticRatingDTO.RatingValue,
                RaterId = criticRatingDTO.RaterId
            };

            _dbContext.CriticRatings.Add(criticRating);
            await _dbContext.SaveChangesAsync();

            return Ok("Rating saved successfully.");
        }



        [HttpPut("modifyCriticRating/{id}")]
        public async Task<ActionResult> PutCriticRating(int id, CriticRatings modifiedCriticRating)
        {
            if (id != modifiedCriticRating.RatingId)
            {
                return BadRequest();
            }

            modifiedCriticRating.ModifiedAt = DateTime.Now;
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
            
            modifiedComment.ModifiedAt = DateTime.Now;
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

        // Favorite endpoints


        [HttpGet("favorites")]
        public async Task<IActionResult> GetFavorites()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            // Retrieve the favorites from the user's Favourites property (stored as a comma-separated string)
            var favoriteIds = user.Favourites?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
            var favorites = await _dbContext.Books.Where(book => favoriteIds.Contains(book.BookId.ToString())).ToListAsync();

            return Ok(favorites);
        }

        [HttpPost("addFavorite/{bookId}")]
        public async Task<IActionResult> AddFavorite(int bookId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var bookExists = await _dbContext.Books.AnyAsync(b => b.BookId == bookId);
            if (!bookExists)
            {
                return BadRequest("The specified Book does not exist.");
            }

            // Add the book ID to the user's Favourites property
            var favoriteIds = user.Favourites?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();
            if (favoriteIds.Contains(bookId.ToString()))
            {
                return BadRequest("This book is already in your favorites.");
            }

            favoriteIds.Add(bookId.ToString());
            user.Favourites = string.Join(",", favoriteIds);

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return Ok("Book added to favorites.");
        }

        [HttpDelete("removeFavorite/{bookId}")]
        public async Task<IActionResult> RemoveFavorite(int bookId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var favoriteIds = user.Favourites?.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList() ?? new List<string>();
            if (!favoriteIds.Contains(bookId.ToString()))
            {
                return BadRequest("This book is not in your favorites.");
            }

            favoriteIds.Remove(bookId.ToString());
            user.Favourites = string.Join(",", favoriteIds);

            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return Ok("Book removed from favorites.");
        }

        [HttpPut("updateFavorites")]
        public async Task<IActionResult> UpdateFavorites([FromBody] List<int> bookIds)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            // Validate that all provided book IDs exist
            var validBooks = await _dbContext.Books
                .Where(book => bookIds.Contains(book.BookId))
                .Select(book => book.BookId)
                .ToListAsync();

            if (validBooks.Count != bookIds.Count)
            {
                return BadRequest("Some provided book IDs are invalid.");
            }

            // Update the user's Favourites property
            user.Favourites = string.Join(",", bookIds);
            _dbContext.Users.Update(user);
            await _dbContext.SaveChangesAsync();

            return Ok("Favorites updated successfully.");
        }


    }
}
