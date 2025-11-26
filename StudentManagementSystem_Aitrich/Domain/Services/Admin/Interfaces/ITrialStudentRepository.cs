using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Services.Admin.DTOs;

namespace Domain.Services.Admin.Interfaces
{
    public interface ITrialStudentRepository
    {
        public Task<TrialStudent> AddTrialStudent(TrialStudent trialStudent);
        public Task<List<TrialStudent>> GetAllTrialStudents();
        public Task<TrialStudent> GetTrialStudentById(Guid trialId);
        public Task<TrialStudent> UpdateTrialStudent(TrialStudent trialStudent);

      public   Task<List<StudentProfile>> GetEnrolledTrialStudents();

        public Task<bool> DeleteTrialStudentById(Guid trialId);
        public Task<List<TrialStudent>> GetTrialStudentByName(string name);

        Task<RegistrationFee?> GetRegistrationFeeByTrialStudentId(Guid trialStudentId);
        Task<RegistrationFee> PayRegistrationFee(Guid trialStudentId, double amount);
        Task<RegistrationFee> GetRegistrationFeeByTrialId(Guid trialStudentId);




    }
}
