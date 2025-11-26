using Domain.Enums;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class ReturnFee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReturnId { get; set; }
        public ReturnMode ReturnMode { get; set; }
        //public double Amount_Should_Pay_By_Student { get; set; }
        public double ReturnAmount { get; set; }
        public DateTime ReturnDate { get; set; }= DateTime.Now;
        public string? Remarks { get; set; }
        [ForeignKey(nameof(Student))]
        public Guid StudentId { get; set; }
        public virtual StudentProfile? Student { get; set; }

    }
}
