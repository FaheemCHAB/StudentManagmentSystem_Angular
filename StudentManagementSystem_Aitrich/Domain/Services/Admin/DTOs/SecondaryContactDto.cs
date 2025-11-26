using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
    public class SecondaryContactDto
    {
        public Guid? SecondaryContactId { get; set; }
        public Guid StudentId { get; set; }
        public string GuardianName { get; set; }
        public string Relation { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
    }
}
