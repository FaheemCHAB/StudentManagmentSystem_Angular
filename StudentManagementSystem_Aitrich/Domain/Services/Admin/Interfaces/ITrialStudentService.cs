using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Services.Admin.DTOs;

namespace Domain.Services.Admin.Interfaces
{
    public interface ITrialStudentService
    {
        public Task<TrialStudentDto> AddTrialStudent(TrialStudentDto trialStudent);
        public Task<List<TrialStudentDto>> GetAllTrialStudents();
        public Task<TrialStudentDto> GetTrialStudentById(Guid trialId);
        public Task<TrialStudentDto> UpdateTrialStudent(Guid trialId, TrialStudentDto trialStudent);

      public  Task<List<StudentProfile>> GetEnrolledTrialStudents();

        public Task<bool> DeleteTrialStudentById(Guid trialId);
        public Task<List<TrialStudentDto>> GetTrialStudentByName(string name);


        Task<RegistrationFee?> GetRegistrationFeeByTrialStudentId(Guid trialStudentId);
        Task<RegistrationFee> PayRegistrationFee(Guid trialStudentId, double amount);

        Task<RegistrationFee> GetRegistrationFeeByTrialId(Guid trialStudentId);
    }
}
