using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Domain.Models
{
    public class TrialStudent
    {
        [Key]
        
        public Guid TrialStudentId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
		public StudentStatus studentStatus { get; set; }
		public string Phone { get; set; }
        public DateTime RegistrationTime { get; set; }
        [ForeignKey(nameof(Course))]
       public Guid? CourseId { get; set; }
        public virtual Course Courses { get; set; }
        public virtual RegistrationFee? RegistrationFee { get; set; }



    }
}
