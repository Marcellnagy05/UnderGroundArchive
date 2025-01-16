namespace UnderGroundArchive_Backend.Models
{
    public class CompletedAchievements
    {
        public int Id { get; set; }
        public int AchievementId { get; set; }
        public string CompleterId { get; set; }
        public Achievements Achievements { get; set; }
        public ApplicationUser Users { get; set; }
    }
}
