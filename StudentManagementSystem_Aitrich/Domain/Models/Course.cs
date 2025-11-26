using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Course
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }=null!;
        public double CourseFee {  get; set; }
        public string CourseDuration { get; set; } = null!;
        public string CourseDescription { get; set; } = null!;
        public int InstallmentCount { get; set; }
        public virtual ICollection<StudentProfile> StudentProfiles { get; set; }=new List<StudentProfile>();
        public virtual ICollection<CourseDetails> CourseDetails { get; set; } = new List<CourseDetails>();

    }
}
