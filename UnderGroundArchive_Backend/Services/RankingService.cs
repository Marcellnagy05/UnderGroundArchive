using Google;
using UnderGroundArchive_Backend.Dbcontext;

namespace UnderGroundArchive_Backend.Services
{
    public class RankingService
    {
        private readonly UGA_DBContext _context;

        public RankingService(UGA_DBContext context)
        {
            _context = context;
        }

        public async Task<bool> AddPointsToUser(string userId, int points, string role)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Különböző szerepkörök különböző pontokat kaphatnak
            switch (role.ToLower())
            {
                case "user":
                    if (user.SubscriptionId > 1)
                    {
                        user.RankPoints += (int)(points * 2);
                    }
                    else
                    {
                        user.RankPoints += points;
                    }
                    break;
                case "author":
                    if (user.SubscriptionId > 1)
                    {
                        user.RankPoints += points;
                    }
                    else
                    {
                        user.RankPoints += (int)(points * 0.5);
                    }
                    break;
                case "admin":
                    break;
                case "moderator":
                    break;
                default:
                    break;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PenalizeUserForReport(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.RankPoints -= (int)(user.RankPoints * 0.05);
            if (user.RankPoints < 0) user.RankPoints = 0;

            await _context.SaveChangesAsync();
            return true;
        }


    }

}
