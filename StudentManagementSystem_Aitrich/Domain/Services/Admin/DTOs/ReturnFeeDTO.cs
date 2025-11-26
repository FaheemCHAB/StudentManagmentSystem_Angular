using Domain.Enums;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class ReturnFeeDTO
    {
        public int ReturnId { get; set; }
        public ReturnMode ReturnMode { get; set; }
        public double ReturnAmount { get; set; }
        public DateTime ReturnDate { get; set; } = DateTime.Now;
        public string? Remarks { get; set; }
        public Guid StudentId { get; set; }
       
    }
}
