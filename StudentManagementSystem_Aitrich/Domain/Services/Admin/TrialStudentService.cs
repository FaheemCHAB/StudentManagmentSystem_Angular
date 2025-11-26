using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;

namespace Domain.Services.Admin
{
    public class TrialStudentService:ITrialStudentService
    {
        private readonly ITrialStudentRepository _repository;

        IMapper mapper;
        private readonly StudentManagementDbContext _context;
        public TrialStudentService(ITrialStudentRepository repository, IMapper mapper, StudentManagementDbContext context)
        {
            _repository = repository;
            this.mapper = mapper;
            _context = context; 
        }

        public async Task<TrialStudentDto> AddTrialStudent(TrialStudentDto trialStudent)
        {

          var student=mapper.Map<TrialStudent>(trialStudent);
            var savedEntity = await _repository.AddTrialStudent(student);
            return mapper.Map<TrialStudentDto>(savedEntity);
        }

        public async Task<bool> DeleteTrialStudentById(Guid trialId)
        {
            var deleted = await _repository.DeleteTrialStudentById(trialId);

            return deleted ;
        }

        public  async Task<List<TrialStudentDto>> GetAllTrialStudents()
        {
           var trialStudents=await _repository.GetAllTrialStudents();
            return mapper.Map<List<TrialStudentDto>>(trialStudents);

        }

        public async Task<List<StudentProfile>> GetEnrolledTrialStudents()
        {
          return await  _repository.GetEnrolledTrialStudents();
        }

        public async Task<TrialStudentDto> GetTrialStudentById(Guid trialId)
        {
          var trialStudentById=await _repository.GetTrialStudentById(trialId);
            return mapper.Map<TrialStudentDto>(trialStudentById);
        }

        public async Task<List<TrialStudentDto>> GetTrialStudentByName(string name)
        {
            var trialStudent = await _repository.GetTrialStudentByName(name);
            return mapper.Map<List<TrialStudentDto>>(trialStudent);
        }

        public async Task<TrialStudentDto> UpdateTrialStudent(Guid trialId, TrialStudentDto trialStudent)
        {
            var existing = await _repository.GetTrialStudentById(trialId);
            if (existing == null)
            {
                throw new KeyNotFoundException("Trial Student not found");
            }
            existing.FirstName = string.IsNullOrWhiteSpace(trialStudent.FirstName) ? existing.FirstName : trialStudent.FirstName;
            existing.LastName = string.IsNullOrWhiteSpace(trialStudent.LastName) ? existing.LastName : trialStudent.LastName;
            existing.Address = string.IsNullOrWhiteSpace(trialStudent.Address) ? existing.Address : trialStudent.Address;
            existing.Email = string.IsNullOrWhiteSpace(trialStudent.Email)? existing.Email : trialStudent.Email;
            existing.Phone = string.IsNullOrWhiteSpace(trialStudent.Phone) ? existing.Phone : trialStudent.Phone;

            var result = await _repository.UpdateTrialStudent(existing);
            return mapper.Map<TrialStudentDto>(result);
        }


        public async Task<RegistrationFee?> GetRegistrationFeeByTrialStudentId(Guid trialStudentId)
        {
            return await _repository.GetRegistrationFeeByTrialStudentId(trialStudentId);
        }

        public async Task<RegistrationFee> PayRegistrationFee(Guid trialStudentId, double amount)
        {
            if (amount <= 0)
                throw new ArgumentException("Payment amount must be greater than zero");

            return await _repository.PayRegistrationFee(trialStudentId, amount);
        }

        public async Task<RegistrationFee> GetRegistrationFeeByTrialId(Guid trialStudentId)
        {
            var entity =await _repository.GetRegistrationFeeByTrialId(trialStudentId);
            return entity;
        }
    }
}
