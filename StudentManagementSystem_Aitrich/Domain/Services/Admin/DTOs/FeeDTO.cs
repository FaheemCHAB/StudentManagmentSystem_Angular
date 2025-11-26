using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class FeeDTO
    {
        public Guid FeeId { get; set; }
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

        //ADDED

        public string? StudentName { get; set; }
        public string? CourseName { get; set; }
        public Guid? StudentId { get; set; }  //added


        //public FeeStructureDTO FeeStructure { get; set; }  //CHANGED
        // public FeeStructureDTO? FeeStructure { get; set; }
    }
}
