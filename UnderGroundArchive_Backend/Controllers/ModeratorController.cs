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
        //request endpoints

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

        //report endpoints

        [HttpGet("reports")]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _dbContext.Reports
                .Select(r => new
                {
                    r.ReportId,
                    r.ReporterId,
                    r.ReportedId,
                    r.ReportTypeId,
                    r.ReportMessage,
                    r.IsHandled,
                    r.CreatedAt
                })
                .ToListAsync();

            return Ok(reports);
        }


        [HttpGet("report/{id}")]
        public async Task<IActionResult> GetReport(int id)
        {
            var report = await _dbContext.Reports
                .Where(r => r.ReportId == id)
                .Select(r => new
                {
                    r.ReportId,
                    r.ReporterId,
                    r.ReportedId,
                    r.ReportTypeId,
                    r.ReportMessage,
                    r.IsHandled,
                    r.CreatedAt
                })
                .FirstOrDefaultAsync();

            return report == null ? NotFound("Report not found.") : Ok(report);
        }
        //status change endpoints

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
