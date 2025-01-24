namespace UnderGroundArchive_Backend.DTO
{
    public class ReportDTO
    {
        public int ReportId { get; set; }
        public string ReporterId { get; set; }
        public string ReportedId { get; set; }
        public int ReportTypeId { get; set; }
        public string? ReportMessage { get; set; }
        public bool IsHandled { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
