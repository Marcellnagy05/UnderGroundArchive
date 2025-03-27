using Microsoft.AspNetCore.Mvc;
using UnderGroundArchive_Backend.Services;

namespace UnderGroundArchive_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RankingController : ControllerBase
    {
        private readonly RankingService _rankingService;

        public RankingController(RankingService rankingService)
        {
            _rankingService = rankingService;
        }

        [HttpPatch("updatePoints")]
        public async Task<IActionResult> UpdatePoints([FromBody] PointUpdateRequest request)
        {
            var success = await _rankingService.AddPointsToUser(request.UserId, request.Points, request.Role);
            if (!success)
                return NotFound("User not found.");

            return Ok("Points updated successfully.");
        }

        [HttpPatch("reportUser")]
        public async Task<IActionResult> ReportUser([FromBody] ReportUserRequest request)
        {
            var success = await _rankingService.PenalizeUserForReport(request.UserId);
            if (!success)
                return NotFound("User not found.");

            return Ok("User penalized successfully.");
        }
    }

    public class PointUpdateRequest
    {
        public string UserId { get; set; }
        public int Points { get; set; }
        public string Role { get; set; }
    }
    public class ReportUserRequest
    {
        public string UserId { get; set; }
    }

}
