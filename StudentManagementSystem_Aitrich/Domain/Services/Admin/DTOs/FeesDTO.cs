using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class FeesDTO
    {
     

        public Guid FeeId { get; set; }
        public int InstallmentNumber { get; set; }
        public DateOnly DueDate { get; set; }
        public double? Amount { get; set; }
        public double? AmountReceived { get; set; }
        public double? DueAmount { get; set; }
        public double? CurrentReceivedAmount { get; set; }
        public DateTime? AmountReceivedDate { get; set; }
        public InstallmentStatus Status { get; set; }
        public PaymentMode? PaymentMode { get; set; }
        public string? Remarks { get; set; }

        // 🔹 New fields
        public Guid CourseId { get; set; }
        public string CourseName { get; set; } = string.Empty;

        public string StudentName { get; set; }  //ADDED
        //public Guid? StudentId { get; set; }  //ADDED
    }
}
