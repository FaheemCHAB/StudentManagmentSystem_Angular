using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class SecondaryContact
    {
        [Key]
        public Guid SecondaryContactId { get; set; }=Guid.NewGuid();
        [ForeignKey(nameof(StudentProfile))]
        public Guid StudentId { get; set; }
        public string GuardianName { get; set; }
        public string Relation { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
        
        public virtual StudentProfile StudentProfile { get; set; }
    }
}
