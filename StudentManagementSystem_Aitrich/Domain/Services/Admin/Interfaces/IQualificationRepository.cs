using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
	public interface IQualificationRepository
	{
		public  Task AddQualification(QualificationMaster qualification);
		public Task<List<QualificationMaster>>  GetAllQualifications();
		Task<bool> DeleteQualificationAsync(Guid id);
		Task<QualificationMaster> GetQualificationById(Guid qualificationId);
		Task<QualificationMaster> UpdateAsync(QualificationMaster course);
		Task<List<QualificationMaster>> GetQualificationByName(string name);
	}
}
