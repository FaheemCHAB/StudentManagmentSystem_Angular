using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.DTOs
{
	public class QualificationMasterDTO
	{
        public Guid QualificationListId { get; set; }

        public string QualificationName { get; set; }
		public string QualificationDiscription { get; set; }	
	}
}
