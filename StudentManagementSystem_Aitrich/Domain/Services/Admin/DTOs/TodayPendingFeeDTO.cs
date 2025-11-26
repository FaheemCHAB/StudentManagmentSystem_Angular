using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class TodayPendingFeeDTO
    {
        public string StudentName { get; set; }
        public string Email { get; set; }
        public double PendingFee { get; set; }
        public DateOnly  DueDate { get; set; }
        public Guid FeeId { get; set; }
    }
}
