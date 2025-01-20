namespace UnderGroundArchive_Backend.DTO
{
    public class CriticRatingDTO
    {
        public int RatingId { get; set; }
        public int BookId { get; set; }
        public int RatingValue { get; set; }
        public string RaterId { get; set; }
        public string? RatingDescription { get; set; }
        public string? BookName { get; set; }
        public int GenreId { get; set; }
        public int CategoryId { get; set; }
    }
}
