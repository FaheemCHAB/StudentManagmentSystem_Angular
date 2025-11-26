using AutoMapper;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
	public class QualificationService: IQualificationService
	{
		private readonly IQualificationRepository _qualificationRepository;
		private readonly IMapper _mapper;

		public QualificationService(IQualificationRepository qualificationRepository, IMapper mapper)
		{
			_qualificationRepository = qualificationRepository;
			_mapper = mapper;
		}

		public async Task<QualificationMasterDTO> AddQualifications(QualificationMasterDTO Qualification)
		{
			QualificationMaster qualification = _mapper.Map<QualificationMaster>(Qualification);
			await _qualificationRepository.AddQualification(qualification);
			return Qualification;
		}
		public async  Task<List<QualificationMasterDTO>> GetAllQualifications()
		{
			var qualifications = await _qualificationRepository.GetAllQualifications();
			var qualificationlist = _mapper.Map<List<QualificationMasterDTO>>(qualifications);
			return qualificationlist;
		}
		public async  Task<bool> DeleteQualificationAsync(Guid id)
		{
  
			try
			{
				var deleted = await _qualificationRepository.DeleteQualificationAsync(id);
				if (!deleted)
				{
					throw new KeyNotFoundException("qualification Not found 0r Already existed");
				}
				return true;
			}
			catch (Exception ex)
			{
				throw new ApplicationException("Anerror occured while deleting the quaification");
			}
		}
		public async Task<List<QualificationMasterDTO>> GetQualificationByName(string name)
		{
			var qualification = await _qualificationRepository.GetQualificationByName(name);
			var qualificationList = _mapper.Map<List<QualificationMasterDTO>>(qualification);
			return qualificationList;
		}

		public async Task<QualificationMasterDTO> UpdateQualificationAsync(Guid id, QualificationMasterDTO dto)
		{
			
			var existing = await _qualificationRepository.GetQualificationById(id);
			if (existing == null)
			{
				throw new KeyNotFoundException("qualification not found");
			}
			existing.QualificationName = string.IsNullOrWhiteSpace(dto.QualificationName) ? existing.QualificationName : dto.QualificationName;
			
			existing.QualificationDiscription = string.IsNullOrWhiteSpace(dto.QualificationDiscription) ? existing.QualificationDiscription : dto.QualificationDiscription;
			

			var result = await _qualificationRepository.UpdateAsync(existing);
			return _mapper.Map<QualificationMasterDTO>(result);

		}

        public async Task<QualificationMasterDTO> GetQualificationById(Guid qualificationId)
        {
            var qualification = await _qualificationRepository.GetQualificationById(qualificationId);
            if (qualification == null)
            {
                throw new ItemNotFoundException("Qualification not found");
            }

            var getQualification = _mapper.Map<QualificationMasterDTO>(qualification);
            return getQualification;
        }

    }
}
	

