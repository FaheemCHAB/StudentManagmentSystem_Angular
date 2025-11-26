using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class StudentProfile
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid StudentId { get; set; }
        public string? StudentReferenceId { get; set; } 
        [ForeignKey(nameof(TrialStudent))]
        public Guid?  TrialStudentId { get; set; }
        public EnrollmentType EnrollmentType { get; set; }
        public Reference ReferredBy {  get; set; } 
        public DateOnly DOB {  get; set; }
        public virtual List<Qualification> Qualification { get; set; } = new List<Qualification>();
        public virtual List<Experience> Experience { get; set; } = new List<Experience>();
        public virtual List<CourseDetails> Course { get; set; } = new List<CourseDetails>();
        public virtual List<FeeStructure> FeeStructure { get; set; }= new List<FeeStructure>();
        public byte[]? Documents { get; set; }
        public virtual TrialStudent? TrialStudent { get; set; }
        public bool IsFullyPaid { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        
        public byte[]? Photo { get; set; }
        public string? PhotoUrl { get; set; }//added
        public StudentStatus studentStatus { get; set; }
        public DateTime RegistrationTime { get; set; }

    }
}
