using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class RegistrationFeeDto
    {
        public Guid RegistrationFeeId { get; set; }
        public Guid TrialStudentId { get; set; }
        public double Fee { get; set; }
        public FeeStatus FeeStatus { get; set; }
        public DateTime FeeReceivedDate { get; set; }
    }
}
