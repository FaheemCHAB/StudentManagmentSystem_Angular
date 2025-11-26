using AutoMapper;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
	public class QualificationRepository:IQualificationRepository
	{
		private readonly StudentManagementDbContext _studentManagementDbContext;

		public QualificationRepository(StudentManagementDbContext studentManagementDbContext)
		{
			_studentManagementDbContext = studentManagementDbContext;
		}

		public async Task AddQualification(QualificationMaster Qualification)
		{

			if (_studentManagementDbContext.QualificationMaster.Any(b => b.QualificationName == Qualification.QualificationName))
			{
				throw new ItemAlreadyExistException("Qualification already available");
			}
			_studentManagementDbContext.QualificationMaster.Add(Qualification);
			await _studentManagementDbContext.SaveChangesAsync();
		}
		public async Task<List<QualificationMaster>> GetAllQualifications()
		{
			return await _studentManagementDbContext.QualificationMaster.ToListAsync();

		}
		public async Task<QualificationMaster> GetQualificationById(Guid QualificationId)
		{
			var course = await _studentManagementDbContext.QualificationMaster.FindAsync(QualificationId);
			if (course == null)
			{
				throw new ItemNotFoundException("Qualification not found");
			}
			return course;
		}
		public async  Task<bool> DeleteQualificationAsync(Guid id)
		{
			var qualification = await GetQualificationById(id);
			if (qualification == null)
			{
				throw new ItemNotFoundException("qualification not found");
			}
			_studentManagementDbContext.QualificationMaster.Remove(qualification);
			await _studentManagementDbContext.SaveChangesAsync();
			return true;
		}
		public async Task<QualificationMaster> UpdateAsync(QualificationMaster qualification)
		{
			_studentManagementDbContext.QualificationMaster.Update(qualification);
			await _studentManagementDbContext.SaveChangesAsync();
			return qualification;
		}
		public async Task<List<QualificationMaster>> GetQualificationByName(string name)
		{
			var qualification = await _studentManagementDbContext.QualificationMaster
					   .Where(c => c.QualificationName.Contains(name)).ToListAsync();
			return qualification;
		}
	}
}
