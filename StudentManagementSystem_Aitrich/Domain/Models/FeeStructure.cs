using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class FeeStructure
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid InstallmentId { get; set; }
        [ForeignKey(nameof(StudentProfile))]
        public Guid StudentId { get; set; }
        [ForeignKey(nameof(CourseDetail))]
        public Guid CourseDetailId { get; set; }
        public int TotalInstallment {  get; set; }
       
        public virtual List<Fee> FeeInstallment { get; set; }=new List<Fee>();
        public virtual StudentProfile? StudentProfile { get; set; }
        public virtual CourseDetails? CourseDetail { get; set; }
    }
}
