using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Domain.Services.Admin
{

    public class TrialStudentRepository : ITrialStudentRepository
    {
        private readonly StudentManagementDbContext _dbcontext;

        public TrialStudentRepository(StudentManagementDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<TrialStudent> AddTrialStudent(TrialStudent trialStudent)
        {
            if (trialStudent == null)
            {
                throw new ArgumentNullException(nameof(trialStudent));
            }
            if (_dbcontext.TrialStudents.Any(t => t.Email == trialStudent.Email))
            {
                throw new ItemAlreadyExistException("Student Email Already Exist");
            }
            trialStudent.RegistrationTime = DateTime.Now;
            trialStudent.studentStatus = Enums.StudentStatus.Registered;
            _dbcontext.TrialStudents.Add(trialStudent);
            await _dbcontext.SaveChangesAsync();
            return await _dbcontext.TrialStudents
        .Include(t => t.Courses)
        .FirstOrDefaultAsync(t => t.TrialStudentId == trialStudent.TrialStudentId);
        }

        public async Task<bool> DeleteTrialStudentById(Guid trialId)
        {
            var trialStudent = await GetTrialStudentById(trialId);
            if (trialStudent == null)
            {
                throw new ItemNotFoundException("Trial Student not found");
            }
            _dbcontext.TrialStudents.Remove(trialStudent);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<List<TrialStudent>> GetAllTrialStudents()
        {
            return await _dbcontext.TrialStudents.Where(e => e.studentStatus == Enums.StudentStatus.Registered).ToListAsync();
        }

        public async Task<List<StudentProfile>> GetEnrolledTrialStudents()
        {
            return await _dbcontext.StudentProfiles
                         .Where(t => t.studentStatus == Enums.StudentStatus.Enrolled)
                         .ToListAsync();
        }

        public async Task<TrialStudent> GetTrialStudentById(Guid trialId)
        {
            var trialStudent = await _dbcontext.TrialStudents.FindAsync(trialId);
            if (trialStudent == null)
            {
                return null;
            }
            return trialStudent;
        }

        public async Task<List<TrialStudent>> GetTrialStudentByName(string name)
        {
            var trialStudent = await _dbcontext.TrialStudents.
               Where(c => c.FirstName.Contains(name)).ToListAsync();

            return trialStudent;

        }

        public async Task<TrialStudent> UpdateTrialStudent(TrialStudent trialStudent)
        {
            _dbcontext.TrialStudents.Update(trialStudent);
            await _dbcontext.SaveChangesAsync();
            return trialStudent;
        }




        public async Task<RegistrationFee?> GetRegistrationFeeByTrialStudentId(Guid trialStudentId)
        {
            return await _dbcontext.RegistrationFees
                .FirstOrDefaultAsync(r => r.TrialStudentId == trialStudentId);
        }

        public async Task<RegistrationFee> PayRegistrationFee(Guid trialStudentId, double amount)
        {
            var trialStudent = await _dbcontext.TrialStudents
                .Include(t => t.RegistrationFee)
                .FirstOrDefaultAsync(t => t.TrialStudentId == trialStudentId);

            if (trialStudent == null)
                throw new ItemNotFoundException("Trial student not found.");

            
            if (amount != 1000)
                throw new InvalidOperationException("Registration fee must be exactly 1000. Partial or excess payments are not allowed.");


            // Prevent duplicate payment
            if (trialStudent.RegistrationFee != null && trialStudent.RegistrationFee.FeeStatus == FeeStatus.Paid)
                throw new InvalidOperationException("Registration fee has already been fully paid.");

            if (trialStudent.RegistrationFee != null)
                throw new InvalidOperationException("Registration fee already exists. Partial top-up is not allowed.");

            // Create registration fee
            trialStudent.RegistrationFee = new RegistrationFee
            {
                TrialStudentId = trialStudentId,
                Fee = amount,
                FeeStatus = FeeStatus.Paid,
                FeeReceivedDate = DateTime.Now
            };

            _dbcontext.RegistrationFees.Add(trialStudent.RegistrationFee);

            // Record transaction
            var transaction = new Transaction
            {
                StudentId = null,
                TrialStudentId = trialStudentId,
                TransactionAmount = amount,
                Status = TransactionMode.Credit,
                Remark = "Registration Fee Payment",
                TransactionDate = DateTime.Now
            };

            _dbcontext.Transactions.Add(transaction);

            await _dbcontext.SaveChangesAsync();

            return trialStudent.RegistrationFee;
        }

        public async Task<RegistrationFee> GetRegistrationFeeByTrialId(Guid trialStudentId)
        {
            var entity= await _dbcontext.RegistrationFees.FirstOrDefaultAsync(s=>s.TrialStudentId == trialStudentId);
            return entity;
        }
    }
}
