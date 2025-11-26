using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Fee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid FeeId { get; set; }
        [ForeignKey(nameof(FeeStructure))]
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
        public virtual FeeStructure? FeeStructure { get; set; }
      
    }
}
