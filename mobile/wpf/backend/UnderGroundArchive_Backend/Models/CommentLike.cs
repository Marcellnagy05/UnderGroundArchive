namespace UnderGroundArchive_Backend.Models
{
    public class CommentLike
    {
        public int Id { get; set; }
        public int CommentId { get; set; }
        public string UserId { get; set; }
        public bool IsLike { get; set; }

        public virtual Comments Comment { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}
