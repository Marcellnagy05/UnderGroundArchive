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
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _dbContext.Requests
                .Select(r => new
                {
                    r.RequestId,
                    r.RequesterId,
                    r.RequestMessage,
                    r.RequestDate,
                    r.IsApproved,
                    r.RequestType
                })
                .ToListAsync();

            return Ok(requests);
        }


        [HttpGet("request/{id}")]
        public async Task<IActionResult> GetRequest(int id)
        {
            var request = await _dbContext.Requests
                .Where(j => j.RequestId == id)
                .Select(r => new
                {
                    r.RequestId,
                    r.RequesterId,
                    r.RequestMessage,
                    r.RequestDate,
                    r.IsApproved,
                    r.RequestType
                })
                .FirstOrDefaultAsync();

            return request == null ? NotFound("Request not found.") : Ok(request);
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

        [HttpPut("handleReport")]
        public async Task<ActionResult> HandleReport(int reportId)
        {
            // Fetch the report by ID
            var report = await _dbContext.Reports.FirstOrDefaultAsync(r => r.ReportId == reportId);

            // If the report is not found, return a 404
            if (report == null)
            {
                return NotFound("Report not found.");
            }

            // Update the IsHandled status to true
            report.IsHandled = true;

            // Save changes to the database
            _dbContext.Reports.Update(report);
            await _dbContext.SaveChangesAsync();

            // Return success response
            return Ok("Report status updated to handled.");
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
