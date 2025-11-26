using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class RegistrationFee
    {
        public Guid RegistrationFeeId { get; set; }
        [ForeignKey(nameof(TrialStudent))]
        public Guid TrialStudentId { get; set; }
        public virtual TrialStudent? TrialStudent { get; set; }
        public double? Fee { get; set; } = 1000;
        public FeeStatus? FeeStatus { get; set; }
        public DateTime? FeeReceivedDate { get; set; } = DateTime.Now;
    }
}
