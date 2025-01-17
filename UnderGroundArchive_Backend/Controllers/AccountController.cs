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
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UGA_DBContext _dbContext;

        private decimal LimitBalance(decimal balance)
        {
            return Math.Round(balance, 2);  // Két tizedesjegyig kerekít
        }

        public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, UGA_DBContext dBContext)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _dbContext = dBContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Login) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Email és jelszó szükséges.");
            }

            // Próbáljuk megkeresni a felhasználót email vagy felhasználónév alapján
            ApplicationUser user = null;
            if (loginDto.Login.Contains("@")) // Ha email formátumban van
            {
                user = await _userManager.FindByEmailAsync(loginDto.Login);
            }
            else
            {
                user = await _userManager.FindByNameAsync(loginDto.Login); // Ha nem email, akkor felhasználónév alapján
            }

            if (user == null)
            {
                return Unauthorized("Hibás felhasználónév vagy jelszó.");
            }

            // Ellenőrizzük a jelszót
            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            if (result.Succeeded)
            {
                // Sikeres bejelentkezés
                return Ok(new { message = "Sikeres bejelentkezés." });
            }
            else
            {
                return Unauthorized("Hibás felhasználónév vagy jelszó.");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO newUser)
        {
            if (newUser == null || string.IsNullOrEmpty(newUser.Name) || string.IsNullOrEmpty(newUser.Email) || string.IsNullOrEmpty(newUser.Password))
            {
                return BadRequest("Hiányzó kötelező mezők.");
            }

            // Ellenőrizzük, hogy a felhasználó már létezik-e
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            if (existingUser != null)
            {
                return BadRequest("A felhasználó már létezik.");
            }

            // Felhasználó létrehozása
            var user = new ApplicationUser
            {
                UserName = newUser.Name,
                Email = newUser.Email,
                BirthDate = newUser.BirthDate,
                Country = newUser.Country,
                Balance = LimitBalance(newUser.Balance)
            };

            // A jelszó hozzáadása és a hashelés automatikusan elvégzése az Identity által
            var result = await _userManager.CreateAsync(user, newUser.Password);
            await _userManager.AddToRoleAsync(user, "User");
            if (!result.Succeeded)
            {
                // Ha nem sikerült a regisztráció, hibaüzenetet adunk vissza
                return BadRequest(result.Errors.Select(e => e.Description));
            }

            return Ok("A felhasználó sikeresen regisztrálva.");
        }
    }
}
