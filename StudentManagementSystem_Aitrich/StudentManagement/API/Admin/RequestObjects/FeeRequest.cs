using Domain.Enums;

namespace StudentManagement.API.Admin.RequestObjects
{
    public class FeeRequest
    {
        public Guid FeeStructureId { get; set; }
        public int InstallmentNumber { get; set; }
        public DateOnly DueDate { get; set; }
        public double? Amount { get; set; }
        public double? AmountReceived { get; set; }
        public double? DueAmount { get; set; }
        public double? CurrentReceivedAmount { get; set; }
        public DateTime? AmountReceivedDate { get; set; } = DateTime.Now;
        public InstallmentStatus Status { get; set; }
        public PaymentMode? PaymentMode { get; set; }
        public string? Remarks { get; set; }
    }
}
