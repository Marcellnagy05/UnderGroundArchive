using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IActionResult> PublishBook([FromBody] BookDTO bookDto)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized("Nem található bejelentkezett felhasználó.");
            }

            // Itt egy Book objektumot hozunk létre a DTO alapján
            var book = new Books
            {
                BookName = bookDto.BookName,
                GenreId = bookDto.GenreId,
                CategoryId = bookDto.CategoryId,
                BookDescription = bookDto.BookDescription,
                AuthorId = user.Id,
            };

            // Könyv mentése
            _dbContext.Books.Add(book);
            await _dbContext.SaveChangesAsync();

            return Ok("A könyv sikeresen publikálva.");
        }
    }
}
