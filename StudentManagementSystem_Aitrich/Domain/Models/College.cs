using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class College
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CollegeId { get; set; }
        public string CollegeName { get; set; } = null!;
        public string Location { get; set; }=null!;
        public string District { get; set; }=null !;
        public string State { get; set; } = null!;
        public string? Phone { get; set; } 
        public string Description { get; set; } = null!;
        public virtual ICollection<Qualification> Qualifications { get; set; }=new List<Qualification>();
    }
}
