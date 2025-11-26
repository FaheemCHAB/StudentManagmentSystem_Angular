using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Domain.Models
{
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid TransactionId { get; set; }

        [ForeignKey(nameof(StudentProfile))]
        public Guid? StudentId { get; set; }
        public virtual StudentProfile? StudentProfile { get; set; }
        [ForeignKey(nameof(TrialStudent))]
        public Guid? TrialStudentId { get; set; }

        public virtual TrialStudent? TrialStudent { get; set; }
        public double TransactionAmount { get; set; }
        public TransactionMode Status { get; set; }
        public string? Remark { get; set; }
        public DateTime TransactionDate { get; set; } = DateTime.Now;
    }
}
