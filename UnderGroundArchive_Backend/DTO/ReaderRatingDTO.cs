namespace UnderGroundArchive_Backend.DTO
{
    public class ReaderRatingDTO
    {
        public int RatingId { get; set; }
        public int BookId { get; set; }
        public int RatingValue { get; set; }
        public string RaterId { get; set; }
        public string? RatingDescription { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string BookName { get; set; }
        public int GenreId { get; set; }
        public int CategoryId { get; set; }
    }
}
