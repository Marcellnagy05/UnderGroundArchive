namespace UnderGroundArchive_Backend.DTO
{
    public class CommentDTO
    {
        public int CommentId { get; set; }
        public string CommentMessage { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
