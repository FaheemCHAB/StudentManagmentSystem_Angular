using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Experience
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid ExperienceId { get; set; }
        [ForeignKey(nameof(Profile))]
        public Guid StudentId { get; set; }
        public string Position { get; set; } = null!;
        public string CompanyName { get; set; }=null!;
        public string TotalExperience { get; set;} = null!;
        public virtual StudentProfile? Profile { get; set; }
    }
}
