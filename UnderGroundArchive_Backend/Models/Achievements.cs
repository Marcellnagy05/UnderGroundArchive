namespace UnderGroundArchive_Backend.Models
{
    public class Achievements
    {
        public int AchievementId { get; set; }
        public int BookId {  get; set; }
        public int PointAmount { get; set; }
        public string AchievementDescription {  get; set; }
        public Books Books { get; set; }
        public ICollection<CompletedAchievements> CompletedAchievements { get; set; }
    }
}
