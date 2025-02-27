namespace UnderGroundArchive_Backend.Models
{
    public class Achievements
    {
        public int AchievementId { get; set; }
        public int PointAmount { get; set; }
        public string AchievementDescription {  get; set; }
        public virtual ICollection<CompletedAchievements> CompletedAchievements { get; set; }
    }
}
