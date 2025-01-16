namespace UnderGroundArchive_Backend.Models
{
    public class Books
    {
        public int BookId { get; set; }
        public string? BookName { get; set; }
        public string AuthorId { get; set; }
        public int GenreId { get; set; }
        public int CategoryId { get; set; }
        public string? BookDescription { get; set; }

        public Genre Genre { get; set; }
        public Categories Categories { get; set; }
        public ApplicationUser Users { get; set; }
        public ICollection<Achievements> Achievements { get; set; }
        public ICollection<Comments> Comments { get; set; }
        public ICollection<ReaderRatings> ReaderRatings { get; set; }
        public ICollection<CriticRatings> CriticRatings { get;set; }
    }
}
