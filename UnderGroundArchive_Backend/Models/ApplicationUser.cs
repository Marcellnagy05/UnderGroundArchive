using Microsoft.AspNetCore.Identity;

namespace UnderGroundArchive_Backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public int RankId { get; set; } = 0;
        public int SubscriptionId { get; set; } = 0;
        public DateTime JoinDate { get; set; } = DateTime.Now;
        public DateTime BirthDate { get; set; }
        public string Country { get; set; }
        public int RankPoints { get; set; } = 0;
        public decimal Balance { get; set; } = 0;
        public string Favourites { get; set; } = "";
        public string Theme { get; set; } = "light";
        public ICollection<Books> Books { get; set; } = new List<Books>();
        public ICollection<Requests> Requests { get; set; } = new List<Requests>();
        public ICollection<CompletedAchievements> CompletedAchievements { get; set; } = new List<CompletedAchievements>();
        public ICollection<Comments> Comments { get; set; } = new List<Comments>();
    }
}
