﻿using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
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

        //Account Login/Register endpoints

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Login) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest("Email és jelszó szükséges.");
            }

       

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

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);
            if (user.IsBanned)
            {
                return Unauthorized("Ez a felhasználó ki van tiltva");
            }
            if (result.Succeeded)
            {
                var theme = user.Theme;
                // JWT generálása
                var token = GenerateJwtToken(user);

                // Válasz visszaadása a tokennel
                return Ok(new { jwt = token }); // Az jwt kulcsot biztosan stringként küldjük vissza
            }
            else
            {
                return Unauthorized("Hibás felhasználónév vagy jelszó.");
            }
        }
        private async Task<string> GetPhoneNumberFromGoogle(string accessToken)
        {
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                var response = await client.GetAsync("https://people.googleapis.com/v1/people/me?personFields=phoneNumbers");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);
                    var phoneNumber = json.RootElement
                        .GetProperty("phoneNumbers")[0]
                        .GetProperty("value")
                        .GetString();

                    return phoneNumber;
                }
            }
            return "N/A"; // Ha nincs telefonszám, akkor "N/A"
        }


        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto request)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                IssuedAtClockTolerance = TimeSpan.FromMinutes(5),
                Audience = new List<string> { "500480770304-ll53e6gspf512sj82sotjmg36vcrqid7.apps.googleusercontent.com" }
            };

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token, settings);

                Console.WriteLine(payload);

                var user = await _userManager.FindByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = payload.FamilyName ?? payload.GivenName ?? payload.Email,
                        Email = payload.Email,
                        PhoneNumber = await GetPhoneNumberFromGoogle(request.Token),
                        Country = payload.Locale ?? "Unknown", // Ha nincs, akkor "Unknown"
                        BirthDate = null, // Ezt manuálisan kell megadni
                        RankId = 1, // Alapértelmezett rang
                        SubscriptionId = 1 // Alapértelmezett előfizetés
                    };

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }

                await _userManager.AddToRoleAsync(user, "User");
                var jwtToken = GenerateJwtToken(user);
                return Ok(new { jwt = jwtToken });
            }
            catch (InvalidJwtException e)
            {
                return BadRequest($"Invalid Google token: {e.Message}");
            }
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string> { _configuration["Authentication:Google:ClientId"] }
                };
                return await GoogleJsonWebSignature.ValidateAsync(token, settings);
            }
            catch
            {
                return null;
            }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO newUser)
        {
            if (newUser == null || string.IsNullOrEmpty(newUser.Name) ||
                string.IsNullOrEmpty(newUser.Email) ||
                string.IsNullOrEmpty(newUser.Password))
            {
                return BadRequest(new { errorCode = "MISSING_FIELDS", message = "Hiányzó kötelező mezők." });
            }

            var existingEmail = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);
            var existingName = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserName == newUser.Name);
            if (existingEmail != null)
            {
                return BadRequest(new { errorCode = "EMAIL_ALREADY_EXISTS", message = "A felhasználó már létezik." });
            }
            else if (existingName != null)
            {
                return BadRequest(new { errorCode = "USERNAME_ALREADY_EXISTS", message = "A felhasználó már létezik." });
            }

            var user = new ApplicationUser
            {
                UserName = newUser.Name,
                Email = newUser.Email,
                BirthDate = newUser.BirthDate,
                Country = newUser.Country,
                PhoneNumber = newUser.PhoneNumber,
                RankId = 1,
                SubscriptionId = 1,
            };

            var result = await _userManager.CreateAsync(user, newUser.Password);
            if (!result.Succeeded)
            {
                var errorMessages = result.Errors.Select(e => e.Description).ToArray();
                return BadRequest(new { errorCode = "REGISTRATION_FAILED", errors = errorMessages });
            }

            await _userManager.AddToRoleAsync(user, "User");

            return Ok(new { message = "A felhasználó sikeresen regisztrálva." });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // Nincs szükség külön backend logikára, csak egy OK választ küldünk vissza
            return Ok(new { message = "Sikeres kijelentkezés." });
        }

        //theme update endpoint

        [HttpPut("updateTheme")]
        public async Task<IActionResult> UpdateTheme([FromBody] ThemeDTO request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);  // Felhasználó ID-jának lekérése

            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található");
            }

            user.Theme = request.Theme;  // Téma frissítése

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok("Téma frissítve");
            }
            else
            {
                return BadRequest("Hiba történt a téma frissítésekor");
            }
        }

        // JWT generálás
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            // Lekérdezzük a felhasználó szerepköreit
            var userRoles = await _userManager.GetRolesAsync(user);

            // LOG: Ellenőrizzük, hogy melyik érték NULL
            Console.WriteLine($"UserName: {user.UserName}");
            Console.WriteLine($"Id: {user.Id}");
            Console.WriteLine($"PhoneNumber: {user.PhoneNumber}");
            Console.WriteLine($"Country: {user.Country}");
            Console.WriteLine($"Email: {user.Email}");
            Console.WriteLine($"BirthDate: {user.BirthDate}");
            Console.WriteLine($"RankId: {user.RankId}");
            Console.WriteLine($"SubscriptionId: {user.SubscriptionId}");

            var claims = new List<Claim>
{
    new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    new Claim(ClaimTypes.NameIdentifier, user.Id ?? string.Empty),
    new Claim("PhoneNumber", user.PhoneNumber ?? string.Empty),
    new Claim("Country", user.Country ?? string.Empty),
    new Claim("Email", user.Email ?? string.Empty),
    new Claim("ProfilePictureId", user.ProfilePictureId.ToString()),

    // Ellenőrizd, hogy biztosan nem null!
    new Claim("BirthDate", user.BirthDate.HasValue ? user.BirthDate.Value.ToString("yyyy-MM-dd") : "N/A"),
    new Claim("RankId", user.RankId.HasValue ? user.RankId.Value.ToString() : "-1"),
    new Claim("SubscriptionId", user.SubscriptionId.HasValue ? user.SubscriptionId.Value.ToString() : "-1"),
};

            // Szerepkörök hozzáadása a tokenhez
            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SA5Tq6PMb/6UKyx7IPCe7c1kISP3wnSoyH/mFeZzxoM="));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        //password change endpoint

        [HttpPut("user/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            // Validate request
            if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { Message = "Both current and new passwords are required." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User is not authenticated." });
            }

            // Retrieve the user from the database
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Verify the current password
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return BadRequest(new { Message = "Current password is incorrect." });
            }

            // Validate the new password (you can adjust this validation as needed)
            if (request.NewPassword.Length < 8)
            {
                return BadRequest(new { Message = "New password must be at least 8 characters long." });
            }

            // Hash the new password and update the user's password
            user.PasswordHash = passwordHasher.HashPassword(user, request.NewPassword);

            // Save changes to the database
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Password changed successfully." });
        }

        //Get subcription,ranks,achievements endpoints

        [HttpGet("ranks")]
        public async Task<ActionResult<IEnumerable<Ranks>>> GetRanks()
        {
            var ranks = await _dbContext.Ranks.ToListAsync();
            if (ranks == null || ranks.Count == 0)
            {
                return NotFound(new { Message = "No ranks found." });
            }
            return Ok(ranks);
        }

        [HttpGet("achievements")]
        public async Task<ActionResult<IEnumerable<Achievements>>> GetAchievements()
        {
            var achievements = await _dbContext.Achievements
                .Include(a => a.CompletedAchievements)
                .ToListAsync();
            if (achievements == null || achievements.Count == 0)
            {
                return NotFound(new { Message = "No achievements found." });
            }
            return Ok(achievements);
        }

        [HttpGet("subscriptions")]
        public async Task<ActionResult<IEnumerable<Subscription>>> GetSubscriptions()
        {
            var subscriptions = await _dbContext.Subscription.ToListAsync();
            if (subscriptions == null || subscriptions.Count == 0)
            {
                return NotFound(new { Message = "No subscriptions found." });
            }
            return Ok(subscriptions);
        }
        [HttpPatch("updateProfilePicture")]
        public async Task<IActionResult> UpdateProfilePicture([FromBody] UpdateProfilePictureDTO request)
        {
            if (request.ProfilePictureId <= 0)
            {
                return BadRequest("Érvénytelen ProfilePictureId.");
            }

            // Bejelentkezett felhasználó azonosítása
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int randomszam = 12;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized($"Felhasználó nem azonosítható. itt lenne a userid: {userId} itt meg a random szám:{randomszam}");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            // 🟢 Frissítjük a ProfilePictureId-t
            user.ProfilePictureId = request.ProfilePictureId;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return StatusCode(500, "Hiba történt a frissítés során.");
            }

            return Ok(new { message = "Profilkép frissítve!", profilePictureId = user.ProfilePictureId });
        }

        [HttpPatch("{userId}/updaterank")]
        public async Task<IActionResult> UpdateRank(string userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található.");
            }

            var ranks = await _dbContext.Ranks
                .OrderBy(r => r.PointsRequired)
                .ToListAsync();

            // Jelenlegi rang keresése
            var currentRank = ranks.LastOrDefault(r => r.PointsRequired <= user.RankPoints);

            if (currentRank != null && user.RankId != currentRank.RankId)
            {
                user.RankId = currentRank.RankId;
                _dbContext.Users.Update(user);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Rang sikeresen frissítve!", newRankId = currentRank.RankId });
            }

            return Ok(new { message = "Nincs szükség rangfrissítésre." });
        }



    }
}
