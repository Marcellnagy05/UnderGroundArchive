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
        
    }
}
