 using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Batch
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid BatchId { get; set; }
        public string BatchName { get; set; } = null!;
        public string BatchTime { get; set; } = null!;
        public  string BatchDescription {  get; set; } = null!; 
        public virtual ICollection<StudentProfile> StudentProfiles { get; set; }=new List<StudentProfile>();
    }
}
