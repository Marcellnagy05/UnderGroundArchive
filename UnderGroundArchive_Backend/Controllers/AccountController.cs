using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly IConfiguration _configuration;
        private readonly UGA_DBContext _dbContext;

        private decimal LimitBalance(decimal balance)
        {
            return Math.Round(balance, 2);  // Két tizedesjegyig kerekít
        }

        public AccountController(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, UGA_DBContext dBContext, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _dbContext = dBContext;
            _configuration = configuration;
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
                // JWT generálása
                var token = GenerateJwtToken(user);

                // Válasz visszaadása a tokennel
                return Ok(new { token });
            }
            else
            {
                return Unauthorized("Hibás felhasználónév vagy jelszó.");
            }
        }

        // JWT generálás
        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SA5Tq6PMb/6UKyx7IPCe7c1kISP3wnSoyH/mFeZzxoM="));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30), // Token érvényességi ideje
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Nincs szükség külön backend logikára, csak egy OK választ küldünk vissza
            return Ok(new { message = "Sikeres kijelentkezés." });
        }

    }
}
