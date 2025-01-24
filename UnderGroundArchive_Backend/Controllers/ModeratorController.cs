using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mysqlx;
using System.Security.Claims;
using UnderGroundArchive_Backend.Dbcontext;
using UnderGroundArchive_Backend.DTO;
using UnderGroundArchive_Backend.Models;

namespace UnderGroundArchive_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModeratorController : ControllerBase
    {
        private readonly UGA_DBContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;

        public ModeratorController(UserManager<ApplicationUser> userManager, UGA_DBContext dBContext)
        {
            _dbContext = dBContext;
            _userManager = userManager;
        }

        [HttpGet("reports")]
        public async Task<ActionResult<IEnumerable<ReportDTO>>> GetReports()
        {
            var reports = await _dbContext.Reports
                .Select(c => new ReportDTO
                {
                    ReportId = c.ReportId,
                    ReporterId = c.ReporterId,
                    ReportedId = c.ReportedId,
                    ReportMessage = c.ReportMessage,
                    ReportTypeId = c.ReportTypeId,
                    CreatedAt = c.CreatedAt,
                    IsHandled = c.IsHandled
                })
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            if (!reports.Any())
            {
                return NotFound("No reports found");
            }
            return Ok(reports);
        }



        [HttpGet("report/{id}")]
        public async Task<ActionResult<ReportDTO>> GetCriticRating(int id)
        {
            var report = await _dbContext.Reports.FirstOrDefaultAsync(j => j.ReportId == id);
            return report == null ? NotFound() : Ok(report);
        }

        [HttpPut("muteStatusChange")]
        public async Task<ActionResult> ChangeMuteStatus(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található");
            }
            if (user.IsMuted)
            {
                user.IsMuted = false;
            }
            else
            {
                user.IsMuted = true;
            }


            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok("Mute status changed");
            }
            else
            {
                return BadRequest("Hiba történt");
            }
        }

        [HttpPut("banStatusChanged")]
        public async Task<ActionResult> ChangeBanStatus(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Felhasználó nem található");
            }
            if (user.IsBanned)
            {
                user.IsBanned = false;
            }
            else
            {
                user.IsBanned = true;
            }


            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok("Ban status changed");
            }
            else
            {
                return BadRequest("Hiba történt");
            }
        }
    }
}
