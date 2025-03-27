namespace UnderGroundArchive_Backend.Models
{
    public class ReaderRatings
    {
        public int RatingId { get; set; }
        public int BookId { get; set; }
        public int RatingValue { get; set; }
        public string RaterId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? ModifiedAt { get; set; }
        public string?  RatingDescription { get; set; }
        public virtual Books? Books { get; set; }
    }
}
