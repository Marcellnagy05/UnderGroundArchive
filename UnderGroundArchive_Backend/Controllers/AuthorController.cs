using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.DTO;
using UnderGroundArchive_Backend.Models;
using UnderGroundArchive_Backend.Services;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UGA_DBContext _dbContext;

        public AuthorController(IBookService bookService, UserManager<ApplicationUser> userManager, UGA_DBContext dBContext)
        {
            _bookService = bookService;
            _userManager = userManager;
            _dbContext = dBContext;
        }

        [HttpPost("publish")]
        [Authorize(Roles = "Author")]
        public async Task<IActionResult> PublishBook([FromBody] PublishBookDTO bookDto)
        {
            if (bookDto == null || string.IsNullOrEmpty(bookDto.BookName) || bookDto.GenreId <= 0 || bookDto.CategoryId <= 0)
            {
                return BadRequest(new { message = "Hiányos vagy érvénytelen adatokat küldtél." });
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Nem található bejelentkezett felhasználó. A token érvénytelen vagy hiányzik." });
            }

            try
            {
                var book = new Books
                {
                    BookName = bookDto.BookName,
                    GenreId = bookDto.GenreId,
                    CategoryId = bookDto.CategoryId,
                    BookDescription = bookDto.BookDescription,
                    AuthorId = userId, // JWT-ből vesszük az AuthorId-t
                                       // Comments, CriticRatings, ReaderRatings kihagyása
                };

                _dbContext.Books.Add(book);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "A könyv sikeresen publikálva.", bookId = book.BookId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Belső szerverhiba történt a könyv mentése során.", error = ex.Message });
            }
        }

    }
}
