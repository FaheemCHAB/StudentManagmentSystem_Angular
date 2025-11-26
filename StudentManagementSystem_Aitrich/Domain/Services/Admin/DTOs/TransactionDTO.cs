using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Domain.Services.Admin.DTOs
{
    public class TransactionDTO
    {
        public string? StudentName { get; set; } 
        public double TransactionAmount { get; set; }
        public TransactionMode Status { get; set; }
        public string? Remark { get; set; } 
        public DateTime TransactionDate { get; set; }
    }
}
