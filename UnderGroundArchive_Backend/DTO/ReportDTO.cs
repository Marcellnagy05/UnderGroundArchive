namespace UnderGroundArchive_Backend.DTO
{
    public class ReportDTO
    {
        public string? ReportedPersonId { get; set; }
        public int? ReportedCommentId { get; set; }
        public int? ReportedBookId { get; set; }
        public int ReportTypeId { get; set; }
        public string? ReportMessage { get; set; }
    }
}
