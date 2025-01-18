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
        [Authorize(Roles = "Author")] // Kötelező a hitelesítés
        public async Task<IActionResult> PublishBook([FromBody] BookDTO bookDto)
        {
            // Ellenőrizzük, hogy a DTO nem null és az adatok meg vannak adva
            if (bookDto == null || string.IsNullOrEmpty(bookDto.BookName) || bookDto.GenreId <= 0 || bookDto.CategoryId <= 0)
            {
                return BadRequest(new { message = "Hiányos vagy érvénytelen adatokat küldtél." });
            }

            // JWT-ből a felhasználó azonosítása
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "Nem található bejelentkezett felhasználó. A token érvénytelen vagy hiányzik." });
            }

            // Felhasználó ellenőrzése az adatbázisban
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Unauthorized(new { message = "Nem található a felhasználó az adatbázisban." });
            }

            try
            {
                // Új könyv létrehozása
                var book = new Books
                {
                    BookName = bookDto.BookName,
                    GenreId = bookDto.GenreId,
                    CategoryId = bookDto.CategoryId,
                    BookDescription = bookDto.BookDescription,
                    AuthorId = user.Id,
                };

                // Adatbázis mentés
                _dbContext.Books.Add(book);
                await _dbContext.SaveChangesAsync();

                // Sikeres válasz
                return Ok(new { message = "A könyv sikeresen publikálva.", bookId = book.BookId });
            }
            catch (Exception ex)
            {
                // Hiba esetén visszatérés
                return StatusCode(500, new { message = "Belső szerverhiba történt a könyv mentése során.", error = ex.Message });
            }
        }

    }
}
