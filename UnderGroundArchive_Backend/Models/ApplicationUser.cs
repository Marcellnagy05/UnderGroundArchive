using Microsoft.AspNetCore.Identity;

namespace UnderGroundArchive_Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int RoleId { get; set; }
        public int RankId { get; set; }
        public int SubscriptionId { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime BirthDate { get; set; }
        public string Country { get; set; }
        public int RankPoints { get; set; }
        public decimal Balance { get; set; }
        public string Favourites { get; set; }

        public ICollection<Books> Books { get; set; }
        public ICollection<Requests> Requests { get; set; }
        public ICollection<CompletedAchievements> CompletedAchievements { get; set; }
        public ICollection<Comments> Comments { get; set; }
    }
}
