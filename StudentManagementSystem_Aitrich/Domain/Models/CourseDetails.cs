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
    public class CourseDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid CourseDetailId { get; set; }
        [ForeignKey(nameof(Profile))]
        public Guid StudentProfileId { get; set; }
        [ForeignKey(nameof(Course))]
        public Guid CourseId { get; set; }
        [ForeignKey(nameof(Batch))]
        public Guid BatchId { get; set; }
        public string TimeSlot { get; set; } = null!;
        public Status Status { get; set; }
        public Mode Mode { get; set; }
        public virtual Course? Course { get; set; }
        public virtual Batch? Batch { get; set; }
        public virtual StudentProfile? Profile { get; set; }
    }
}
