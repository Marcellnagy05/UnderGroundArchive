namespace UnderGroundArchive_Backend.Models
{
    public class Genre
    {
        public int GenreId {  get; set; }
        public string GenreName { get; set; }
        public bool? IsAgeRestricted { get; set; }

        public virtual ICollection<Books> Books { get; set; }
    }
}
