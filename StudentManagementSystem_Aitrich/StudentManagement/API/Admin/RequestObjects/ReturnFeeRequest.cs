using Domain.Enums;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class ReturnFeeRequest
    {
        public ReturnMode ReturnMode { get; set; }
        public double ReturnAmount { get; set; }
        public DateTime ReturnDate { get; set; } = DateTime.Now;
        public string? Remarks { get; set; }
        public Guid StudentId { get; set; }
    }
}
