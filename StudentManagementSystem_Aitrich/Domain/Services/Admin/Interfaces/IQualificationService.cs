using Domain.Models;
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
	public interface IQualificationService
	{
		public Task<QualificationMasterDTO> AddQualifications(QualificationMasterDTO qualificationMasterDTO);
		Task<List<QualificationMasterDTO>> GetAllQualifications();
		Task<bool> DeleteQualificationAsync(Guid id);
		Task<QualificationMasterDTO> UpdateQualificationAsync(Guid id, QualificationMasterDTO dto);
		Task<List<QualificationMasterDTO>> GetQualificationByName(string name);
        Task<QualificationMasterDTO> GetQualificationById(Guid qualificationId);
    }
}
