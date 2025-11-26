using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Qualification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid QualificationId { get; set; }
        [ForeignKey(nameof(Profile))]
        public Guid StudentId { get; set; }
        public string QualificationName { get; set; } = null!;

        [ForeignKey(nameof(College))]
        public Guid CollegeId { get; set; }
        public string PassOutYear { get; set; } = null!;
        public virtual College? College { get; set; }
        public virtual StudentProfile? Profile { get; set; }
    }
}
