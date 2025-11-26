
﻿using AutoMapper;
using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Http;


using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Services.Admin
{
    public class StudentProfileRepository : IStudentProfileRepository
    {
		private readonly ITrialStudentService _studentService;
        
		private readonly StudentManagementDbContext _context;

        public object TransactionModel { get; private set; }

        public StudentProfileRepository(StudentManagementDbContext context, ITrialStudentService studentService)
        {
            _context = context;
            _studentService = studentService;
            

        }

        public async Task<CourseDetails> AddCourseDetails(CourseDetails newCourseDetails)
        {
            var result = await _context.CourseDetails.AddAsync(newCourseDetails);
            await _context.SaveChangesAsync();
            return result.Entity;
        }



        public async Task AddExperience(Experience newExperience)
        {
            var exists = await _context.Experiences.AnyAsync(e =>
                e.StudentId == newExperience.StudentId &&
                e.CompanyName == newExperience.CompanyName &&
                e.Position == newExperience.Position);

            if (exists)
            {
                throw new ItemAlreadyExistException("This experience already exists for the student.");
            }

            _context.Experiences.Add(newExperience);
            await _context.SaveChangesAsync();
        }

        //CHANGED
        public async Task AddFee(List<Fee> fees)
        {
            if (fees == null || !fees.Any())
                throw new ArgumentException("Fee list is empty.");

            fees = fees.OrderBy(f => f.InstallmentNumber).ToList();
            var firstFee = fees.FirstOrDefault(f => f.InstallmentNumber == 1 && f.DueDate != default)
                           ?? fees.FirstOrDefault(f => f.DueDate != default);

            if (firstFee == null)
                throw new ArgumentException("At least the first installment must have a valid DueDate.");

            var baseDate = firstFee.DueDate;

            for (int i = 0; i < fees.Count; i++)
            {
                var nextDate = baseDate.AddMonths(i);
                int lastDay = DateTime.DaysInMonth(nextDate.Year, nextDate.Month);
                int day = Math.Min(baseDate.Day, lastDay);

                fees[i].DueDate = new DateOnly(nextDate.Year, nextDate.Month, day);

             
                if (!Enum.IsDefined(typeof(InstallmentStatus), fees[i].Status))
                    fees[i].Status = InstallmentStatus.Pending;
            }

        
            var feeStructureId = fees.First().FeeStructureId;
            var feeStructure = await _context.FeeStructures.Include(fs => fs.StudentProfile).FirstOrDefaultAsync(fs => fs.InstallmentId == feeStructureId);  //CHANGED
            




            if (feeStructure?.StudentProfile?.TrialStudentId != null)
            {
                var regFee = await _studentService.GetRegistrationFeeByTrialId(feeStructure.StudentProfile.TrialStudentId.Value);
                if (regFee?.FeeStatus == FeeStatus.Paid)
                {
                    var firstInstallment = fees.OrderBy(f => f.InstallmentNumber).FirstOrDefault();
                    if (firstInstallment != null)
                    {
                        firstInstallment.AmountReceived = 1000;
                        firstInstallment.DueAmount = 0;
                        firstInstallment.Status = InstallmentStatus.Paid;

                        var transaction = new Models.Transaction
                        {
                            StudentId = feeStructure.StudentProfile.StudentId,
                            TransactionAmount = 1000,
                            Status = TransactionMode.Credit,
                            Remark = "Registration Fee",
                            TransactionDate = DateTime.Now
                        };
                        await _context.Transactions.AddAsync(transaction);
                    }
                }
            }

            _context.Fees.AddRange(fees);
            await _context.SaveChangesAsync();
        



        }
        public async Task AddMoreCourseFee(List<Fee> fees)
        {
            if (fees == null || !fees.Any())
                throw new ArgumentException("Fee list is empty.");

            var feeStructureId = fees.First().FeeStructureId;

            _context.Fees.AddRange(fees);
            await _context.SaveChangesAsync();
        }
        public async Task<FeeStructure> AddFeeStructure(FeeStructure newFeeStructure)
        {


           

            var feeStruct=_context.FeeStructures.Add(newFeeStructure);
            await _context.SaveChangesAsync();

			var listofstudents = await _studentService.GetAllTrialStudents();


            var student = await _context.StudentProfiles.Where(e => e.StudentId == newFeeStructure.StudentId).FirstOrDefaultAsync();
            var toupdate = await _context.TrialStudents.Where(e => e.TrialStudentId == student.TrialStudentId).FirstOrDefaultAsync();
            toupdate.studentStatus = StudentStatus.Enrolled;
            _context.TrialStudents.Update(toupdate);
            _context.SaveChanges();
            return feeStruct.Entity;


        }



        public async Task AddQualification(Qualification newQualification)
        {
            // Optional: Check for duplicate qualification for the same student
            var exists = await _context.Qualifications.AnyAsync(q =>
                q.StudentId == newQualification.StudentId &&
                q.QualificationName == newQualification.QualificationName &&
                q.CollegeId == newQualification.CollegeId &&
                q.PassOutYear == newQualification.PassOutYear);

            if (exists)
            {
                throw new ItemAlreadyExistException("This qualification already exists for the student.");
            }

            _context.Qualifications.Add(newQualification);
            await _context.SaveChangesAsync();
        }
        public async Task<List<Qualification>> GetQualificationsByStudentId(string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("studentId cannot be null or empty.", nameof(studentId));

            if (!Guid.TryParse(studentId, out var parsedStudentId))
                throw new ArgumentException("studentId must be a valid GUID.", nameof(studentId));

            if (parsedStudentId == Guid.Empty)
                throw new ArgumentException("studentId cannot be an empty GUID.", nameof(studentId));

            return await _context.Qualifications
                .Where(q => q.StudentId == parsedStudentId)
                .ToListAsync();
        }


        public async Task<StudentProfile> AddStudentProfile(StudentProfile newStudent)
        {
            if (newStudent == null)
            {
                throw new ArgumentNullException(nameof(newStudent));
            }
            if (_context.StudentProfiles.Any(t => t.Email == newStudent.Email))
            {
                throw new ItemAlreadyExistException("Student Already Added");
            }
            else 
            {
                if (newStudent.EnrollmentType == EnrollmentType.FromTrialStudent)
                {
                    // Make sure TrialStudentId is present
                    if (newStudent.TrialStudentId == null)
                        throw new ArgumentException("TrialStudentId must be provided for FromTrialStudent enrollment");

                    //Fetch the existing TrialStudent
                    var trialStudent = await _context.TrialStudents
                        .FirstOrDefaultAsync(t => t.TrialStudentId == newStudent.TrialStudentId);

                    if (trialStudent == null)
                        throw new Exception("Trial student not found");

                    //Update TrialStudent status to Enrolled
                    trialStudent.studentStatus = StudentStatus.Enrolled;
                    _context.TrialStudents.Update(trialStudent);

                    //Also update StudentProfile status
                    newStudent.studentStatus = StudentStatus.Enrolled;
                    newStudent.RegistrationTime = DateTime.Now;
                    if (string.IsNullOrEmpty(newStudent.StudentReferenceId))
                    {
                        newStudent.StudentReferenceId = await GenerateStudentIdAsync();
                    }

                    var profile = _context.StudentProfiles.Add(newStudent);
                    await _context.SaveChangesAsync();
                    return profile.Entity;
                }
                else
                {
                    var newTrial = new TrialStudent
                    {
                        TrialStudentId = Guid.NewGuid(),
                        FirstName = newStudent.FirstName,
                        LastName = newStudent.LastName,
                        Email = newStudent.Email,
                        Address = newStudent.Address,
                        Phone = newStudent.Phone,
                        studentStatus = StudentStatus.Enrolled,
                        RegistrationTime = DateTime.Now
                    };

                    // Set TrialStudentId and studentStatus in StudentProfile
                    newStudent.TrialStudentId = newTrial.TrialStudentId;
                    newStudent.studentStatus = StudentStatus.Enrolled;
                    newStudent.RegistrationTime = DateTime.Now;
                    _context.TrialStudents.Add(newTrial);
                    if (string.IsNullOrEmpty(newStudent.StudentReferenceId))
                    {
                        newStudent.StudentReferenceId = await GenerateStudentIdAsync();
                    }

                    var profile = _context.StudentProfiles.Add(newStudent);
                    await _context.SaveChangesAsync();
                    return profile.Entity;
                }
            }

           
        }


        public async Task<bool> DeleteCourseDetails(Guid id)
        {
            try
            {
                var course = await _context.CourseDetails.FindAsync(id);
                if (course != null)
                {
                    _context.CourseDetails.Remove(course);
                    await _context.SaveChangesAsync();
                    return true;
                }

                throw new ItemNotFoundException("Course details not found");
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting course details", ex);
            }
        }

        public async Task<bool> DeleteExperience(Guid id)
        {
            var deleteexp = await GetExperienceById(id);
            if (deleteexp == null)
            {
                throw new NotImplementedException("Experience noy found");
            }
            _context.Experiences.Remove(deleteexp);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<Experience>> GetExperiencesByStudentId(string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("studentId cannot be null or empty.", nameof(studentId));

            if (!Guid.TryParse(studentId, out var parsedStudentId))
                throw new ArgumentException("studentId must be a valid GUID.", nameof(studentId));

            if (parsedStudentId == Guid.Empty)
                throw new ArgumentException("studentId cannot be an empty GUID.", nameof(studentId));

            return await _context.Experiences
                .Where(e => e.StudentId == parsedStudentId)
                .ToListAsync();
        }
        public async Task<List<CourseDetails>> GetCourseDetailsByStudentId(string studentProfileId)
        {
            if (string.IsNullOrWhiteSpace(studentProfileId))
                throw new ArgumentException("studentProfileId cannot be null or empty.", nameof(studentProfileId));

            if (!Guid.TryParse(studentProfileId, out var parsedStudentProfileId))
                throw new ArgumentException("studentProfileId must be a valid GUID.", nameof(studentProfileId));

            if (parsedStudentProfileId == Guid.Empty)
                throw new ArgumentException("studentProfileId cannot be an empty GUID.", nameof(studentProfileId));

            return await _context.CourseDetails
                .Where(cd => cd.StudentProfileId == parsedStudentProfileId)
                .ToListAsync();
        }
        public async Task<List<FeeStructure>> GetFeeStructuresByStudentId(string studentId)
        {
            if (!Guid.TryParse(studentId, out var parsedStudentId))
            {
                throw new ArgumentException("Invalid student ID format.");
            }

            return await _context.FeeStructures
                .Where(fs => fs.StudentId == parsedStudentId)
                .Include(fs => fs.FeeInstallment)
                .ToListAsync();
        }

        public async Task<bool> DeleteFee(Guid feeId)
        {
            var fee = await _context.Fees.FindAsync(feeId);
            if(fee == null)
            {
                throw new ItemNotFoundException("Not found.");
            }
            _context.Fees.Remove(fee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteFeeStructure(Guid id)
        {
            var feeStructure =await _context.FeeStructures.FindAsync(id);
            if(feeStructure == null)
            {
                throw new ItemNotFoundException("Not found.");
            }
            _context.FeeStructures.Remove(feeStructure);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteQualification(Guid id)
        {
           var deletequali = await GetQualificationById(id);
            if (deletequali == null)
            {
                throw new NotImplementedException("Qualification not found");
            }
            _context.Remove(deletequali);
            await _context.SaveChangesAsync();
            return true;
        }
        //added
        public async Task<bool> DeleteStudentProfile(Guid id)
        {
            try
            {
                
                var profile = await _context.StudentProfiles
                    .Include(s => s.TrialStudent)
                    .FirstOrDefaultAsync(s => s.StudentId == id);

                if (profile == null)
                {
                    return false;
                }

                var transactions = _context.Transactions
                    .Where(t => t.StudentId == id);

                _context.Transactions.RemoveRange(transactions);

                if (profile.TrialStudent != null)
                {
                    _context.TrialStudents.Remove(profile.TrialStudent);
                }

             
                _context.StudentProfiles.Remove(profile);

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while deleting StudentProfile", ex);
            }
        }



        //public async Task<bool> DeleteStudentProfile(Guid id)
        //{
        //    var profile = await _context.StudentProfiles
        // .Include(s => s.TrialStudent)
        // .FirstOrDefaultAsync(s => s.StudentId == id);

        //    if (profile == null)
        //    {
        //        throw new ItemNotFoundException("Not found.");
        //    }
        //    _context.StudentProfiles.Remove(profile);
        //    await _context.SaveChangesAsync();
        //    return true;
        //}

        public async Task<List<CourseDetails>> GetAllCourseDetails()
        {
            try
            {
                return await _context.CourseDetails.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving course details", ex);
            }
        }

        public async Task<List<Experience>> GetAllExperience()
        {
            var expList = await _context.Experiences.ToListAsync();
            return expList;
        }

        public async Task<List<Fee>> GetAllFee(Guid feeStructureId)
        {
            var fees= await _context.Fees.Where(f=>f.FeeStructureId == feeStructureId).ToListAsync();
            if (fees == null)
            {
                throw new ItemNotFoundException("Not found");
            }
            return fees;
        }

        public async Task<List<FeeStructure>> GetAllFeeStructure()
        {
            var feeStructures = await _context.FeeStructures
                                .Include(f=>f.StudentProfile)
                                .Include(f=>f.CourseDetail)
                                .Include(f=>f.FeeInstallment)
                                .ToListAsync();
            return feeStructures;
        }

        public async Task<List<Qualification>> GetAllQualifications()
        {
            var qualificationList = await _context.Qualifications.Include(q=>q.College ).

               
                 ToListAsync();    

            return qualificationList;   
        }

        public async Task<List<StudentProfile>> GetAllStudentProfiles()
        {
            return await _context.StudentProfiles
           .Include(s => s.TrialStudent)
           .ToListAsync();
        }

        public async Task<CourseDetails> GetCourseDetailsById(Guid courseId)
        {

            try
            {
                return await _context.CourseDetails
           .Include(cd => cd.Course)
           .FirstOrDefaultAsync(cd => cd.CourseDetailId == courseId);

            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving course details by ID", ex);
            }
        }

        public async Task<Experience> GetExperienceById(Guid id)
        {
            var experience = await  _context.Experiences.FindAsync(id);
            if(experience == null)
            {
                throw new ItemNotFoundException("Experience not found");

            }
            return experience;
        }

        public async Task<Fee> GetFeeById(Guid feeId)
        {
            var fee =await _context.Fees.FindAsync(feeId);
            if(fee == null)
            {
                throw new ItemNotFoundException("Not found.");
            }
            return fee;
        }

        public async Task<FeeStructure> GetFeeStructureById(Guid id)
        {
            var feeStructure = await _context.FeeStructures
                               .Include(f => f.StudentProfile)
                               .Include(f => f.CourseDetail)
                               .FirstOrDefaultAsync(f => f.InstallmentId == id);
            if (feeStructure == null)
            {
                throw new ItemNotFoundException("Not found.");
            }
            return feeStructure;
        }

        public async Task<Qualification> GetQualificationById(Guid id)
        {
            var qualification = await _context.Qualifications.Include(q=>q.College).
                 FirstOrDefaultAsync(q=>q.QualificationId==id);
            if (qualification == null)
            {
                throw new ItemNotFoundException("Qualification not found");
            }
            return qualification;
        }

        public async Task<StudentProfile> GetStudentProfileById(Guid id)
        {
            return await _context.StudentProfiles
             .Include(s => s.TrialStudent)
             .FirstOrDefaultAsync(s => s.StudentId == id);
        }



        public async Task<Fee> UpdateFee(Fee fee)
        {
             _context.Fees.Update(fee);
             await _context.SaveChangesAsync();
            return fee;
        }


        public async Task<List<StudentProfile>> SearchByName(string name)


        {
            return await _context.StudentProfiles
                .Include(s => s.TrialStudent)
                .Where(s => s.TrialStudent != null &&
            s.TrialStudent.FirstName.ToLower().Contains(name.ToLower())).ToListAsync();
        }




        

        public async Task<List<CourseDetails>> SearchCourseDetails(string name)

        {
           return await _context.CourseDetails.
                Include(c=>c.Course).
                Include(c=>c.Batch).
                
                Where(c=>c.Course.CourseName.Contains(name)).ToListAsync();
        }

        public async Task<List<Experience>> SearchExperience(string name)
        {
           var expname = await _context.Experiences.
                Where(e => e.CompanyName.Contains(name)).ToListAsync();
            return expname;
        }

        public async Task<List<TodayPendingFeeDTO>> SearchFee(DateOnly dueDate)
        {
            var fees = await _context.Fees
            .Include(f => f.FeeStructure)
                .ThenInclude(fs => fs.StudentProfile)
            .Where(f => f.DueDate == dueDate &&
                       (f.Status == InstallmentStatus.Pending || f.Status == InstallmentStatus.PartiallyPaid))
            .ToListAsync();


            var feeDtos = fees.Select(f =>
            {
                var profile = f.FeeStructure?.StudentProfile;
                string name = $"{profile?.FirstName} {profile?.LastName}".Trim();
                string email = profile?.Email ?? "";

                double pendingFee = 0;
                if ((f.DueAmount ?? 0) == 0 && f.Status == InstallmentStatus.PartiallyPaid)
                {
                    pendingFee = f.Amount ?? 0;
                }
                else if ((f.DueAmount ?? 0) != 0 && f.Status != InstallmentStatus.Paid)
                {
                    pendingFee = f.DueAmount ?? 0;
                }
                else if ((f.DueAmount ?? 0) != 0 && f.Status != InstallmentStatus.Pending)
                {
                    pendingFee = f.DueAmount ?? 0;
                }

                return new TodayPendingFeeDTO
                {
                    StudentName = name,
                    Email = email,
                    PendingFee = pendingFee,
                    DueDate = f.DueDate
                };
            }).ToList();

            return feeDtos;
        }


        public async Task<List<FeeStructure>> SearchFeeStructure(string name)
        {
            var feeStructure = await _context.FeeStructures
                              .Where(f => f.StudentProfile != null &&
                                     f.StudentProfile.TrialStudent != null &&
                                     f.StudentProfile.TrialStudent.FirstName == name)
                              .ToListAsync();
            return feeStructure;
        }

        public async Task<List<Qualification>> SearchQualification(string name)
        {
           var qualification = await _context.Qualifications.
                Where(q=>q.QualificationName.Contains(name)).ToListAsync();
            return qualification;
        }



        public async Task<CourseDetails> UpdateCourseDetails(Guid id, CourseDetails courseDetails)
        {
            // Find the existing entity in the context to ensure it's tracked
            var existing = await _context.CourseDetails.FindAsync(id);
            if (existing == null)
            {
                throw new Exception($"Course details with ID {id} not found.");
            }

            // Update properties explicitly
            existing.StudentProfileId = courseDetails.StudentProfileId;
            existing.CourseId = courseDetails.CourseId;
            existing.BatchId = courseDetails.BatchId;
            existing.TimeSlot = courseDetails.TimeSlot;
            existing.Status = courseDetails.Status;
            existing.Mode = courseDetails.Mode;

            // Mark the entity as modified (optional, as EF tracks changes to attached entities)
            _context.Entry(existing).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return existing;
        }
        public async Task<Experience> UpdateExperience(Experience experience)
        {
           _context.Experiences.Update(experience);
            await _context.SaveChangesAsync();
            return experience;

        }

        public async Task<FeeStructure> UpdateFeeStructure(FeeStructure feeStructure)
        {
            _context.FeeStructures.Update(feeStructure);
            await _context.SaveChangesAsync();
            return feeStructure;
        }

        public async Task<Qualification> UpdateQualification(Qualification qualification)
        {
            if (qualification == null)
            {
                throw new ArgumentNullException(nameof(qualification), "Qualification cannot be null.");
            }

            var existingQualification = await _context.Qualifications
                .Include(q => q.College)
                .FirstOrDefaultAsync(q => q.QualificationId == qualification.QualificationId);

            if (existingQualification == null)
            {
                throw new KeyNotFoundException($"Qualification with ID {qualification.QualificationId} not found.");
            }

            // Update properties
            existingQualification.QualificationName = qualification.QualificationName;
            existingQualification.PassOutYear = qualification.PassOutYear;
            existingQualification.CollegeId = qualification.CollegeId;

            _context.Entry(existingQualification).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return existingQualification;
        }
        public async Task<StudentProfile> UpdateStudentProfile(StudentProfile student)
        {
            _context.StudentProfiles.Update(student);
            await _context.SaveChangesAsync();
            return student;

        }

        public async Task<StudentProfile> UploadDocument(Guid StudentId, byte[] file)
        {
            var student = await _context.StudentProfiles.FirstOrDefaultAsync(s => s.StudentId == StudentId);

            if (student != null)
            {
                student.Documents = file;
                await _context.SaveChangesAsync(); 
            }

            return student;




        }

        public async Task<byte[]> GetDocumentByStudentId(Guid studentId)
        {
            var student = await _context.StudentProfiles.FirstOrDefaultAsync(s => s.StudentId == studentId);
            if(student != null)
            {
                return student.Documents;
            }

            return null;
        }

        public async Task<List<Fee>> SearchFeeByRange(DateOnly startDate, DateOnly endDate,InstallmentStatus? status)
        {
            var query = _context.Fees.AsQueryable();

            query = query.Where(f => f.DueDate >= startDate && f.DueDate <= endDate);

            if (status != null)
            {
                query = query.Where(f => f.Status == status);
            }

            var fees = await query.ToListAsync();

            if (fees.Count == 0)
            {
                throw new ItemNotFoundException("No fees found for the given criteria");
            }

            return fees;
        }

        //changed

        public async Task<List<Fee>> GetAllFees()
        {
            var fees = await _context.Fees
                      .Include(f => f.FeeStructure)
                         .ThenInclude(fs => fs.StudentProfile)
                            .ThenInclude(sp => sp.TrialStudent)
                      .Include(f => f.FeeStructure)
                         .ThenInclude(fs => fs.CourseDetail)
                            .ThenInclude(cd => cd.Course)
                       .ToListAsync();
            return fees;
        }

        // ADDED
        public async Task<List<Fee>> GetFeesByStudentId(string studentId)
        {
            if (!Guid.TryParse(studentId, out var parsedStudentId))
                throw new ArgumentException("Invalid student ID format.");

        
            var fees = await _context.Fees
                .Include(f => f.FeeStructure)
                    .ThenInclude(fs => fs.StudentProfile)
                        .ThenInclude(sp => sp.TrialStudent)
                .Include(f => f.FeeStructure)
                    .ThenInclude(fs => fs.CourseDetail)
                        .ThenInclude(cd => cd.Course)
                .Where(f => f.FeeStructure != null && f.FeeStructure.StudentId == parsedStudentId)
                .OrderBy(f => f.InstallmentNumber)
                .ToListAsync();

            return fees;
        }


        public async Task<List<Fee>> GetFeesByFeeStructureId(string feeStructureId)
        {
            if (string.IsNullOrWhiteSpace(feeStructureId))
                throw new ArgumentException("feeStructureId cannot be null or empty.", nameof(feeStructureId));

            if (!Guid.TryParse(feeStructureId, out var parsedFeeStructureId))
                throw new ArgumentException("feeStructureId must be a valid GUID.", nameof(feeStructureId));

            if (parsedFeeStructureId == Guid.Empty)
                throw new ArgumentException("feeStructureId cannot be an empty GUID.", nameof(feeStructureId));

            return await _context.Fees
                .Where(f => f.FeeStructureId == parsedFeeStructureId)
                .ToListAsync();
        }
        public async Task DeleteRelatedQualifications(Guid studentId)
        {
            var qualifications = await _context.Qualifications
                .Where(q => q.StudentId == studentId)
                .ToListAsync();
            _context.Qualifications.RemoveRange(qualifications);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRelatedExperiences(Guid studentId)
        {
            var experiences = await _context.Experiences
                .Where(e => e.StudentId == studentId)
                .ToListAsync();
            _context.Experiences.RemoveRange(experiences);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRelatedCourseDetails(Guid studentId)
        {
            var courseDetails = await _context.CourseDetails
                .Where(cd => cd.StudentProfileId == studentId)
                .ToListAsync();
            _context.CourseDetails.RemoveRange(courseDetails);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRelatedFeeStructures(Guid studentId)
        {
            var feeStructures = await _context.FeeStructures
                .Where(fs => fs.StudentId == studentId)
                .ToListAsync();

            foreach (var feeStructure in feeStructures)
            {
                var fees = await _context.Fees
                    .Where(f => f.FeeStructureId == feeStructure.InstallmentId)
                    .ToListAsync();
                _context.Fees.RemoveRange(fees);
            }

            _context.FeeStructures.RemoveRange(feeStructures);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRelatedFees(Guid installmentId)
        {
            var fees = await _context.Fees
                .Where(f => f.FeeStructureId == installmentId)
                .ToListAsync();
            _context.Fees.RemoveRange(fees);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Fee>> UpdateFeeByFeeStructureId(Guid feeStructureId, List<Fee> feeRequests)
        {
            var existingFees = await _context.Fees
       .Where(f => f.FeeStructureId == feeStructureId)
       .OrderBy(f => f.InstallmentNumber)
       .ToListAsync();

            foreach (var feeRequest in feeRequests)
            {
                var feeIndex = existingFees.FindIndex(f => f.FeeId == feeRequest.FeeId);
            if (feeIndex >= 0)
            {
                var fee = existingFees[feeIndex];

                double remainingPayment = feeRequest.AmountReceived ?? 0;

                // Apply to current fee
                fee.AmountReceived = (fee.AmountReceived ?? 0) + remainingPayment;
                fee.DueAmount = (fee.Amount ?? 0) - (fee.AmountReceived ?? 0);
                fee.PaymentMode = feeRequest.PaymentMode;
                fee.Remarks = feeRequest.Remarks;
                fee.AmountReceivedDate = feeRequest.AmountReceivedDate;
                fee.Status = feeRequest.Status;

                // Carry Forward Logic
                double overpayment = -(fee.DueAmount ?? 0);
                if (overpayment > 0)
                {
                    fee.AmountReceived = fee.Amount ?? 0;  // fully paid
                    fee.DueAmount = 0;
                    fee.Status = (int)InstallmentStatus.Paid;

                    // Carry forward to next installments
                    for (int i = feeIndex + 1; i < existingFees.Count && overpayment > 0; i++)
                    {
                        var nextFee = existingFees[i];
                        nextFee.AmountReceived = (nextFee.AmountReceived ?? 0) + overpayment;
                        nextFee.DueAmount = (nextFee.Amount ?? 0) - (nextFee.AmountReceived ?? 0);

                        if (nextFee.DueAmount <= 0)
                        {
                            overpayment = -nextFee.DueAmount ?? 0;
                            nextFee.AmountReceived = nextFee.Amount ?? 0;
                            nextFee.DueAmount = 0;
                            nextFee.Status = (int)InstallmentStatus.Paid;
                        }
                        else
                        {
                            nextFee.Status =(InstallmentStatus) ((nextFee.AmountReceived > 0) ? (int)InstallmentStatus.PartiallyPaid : (int)InstallmentStatus.Pending);
                            overpayment = 0;
                        }
                    }
                }
                else
                {
                    fee.Status =(InstallmentStatus) ((fee.DueAmount == 0) ? (int)InstallmentStatus.Paid :
                                 (fee.AmountReceived > 0) ? (int)InstallmentStatus.PartiallyPaid :
                                 (int)InstallmentStatus.Pending);
                }
            }
        }


        await _context.SaveChangesAsync();

            
            return existingFees;
        }






        public async Task<List<Fee>> UpdateFeeByFeeStructureIdAllocation(Guid feeStructureId, List<Fee> feeRequests)
        {
            double totalCurrentReceivedAmount = 0;
            string transRemark = "";
            var existingFees = await _context.Fees.Where(f => f.FeeStructureId == feeStructureId).ToListAsync();
            foreach (var feeRequest in feeRequests)
            {
                var existingFee = existingFees.FirstOrDefault(f => f.FeeId == feeRequest.FeeId);
                if (existingFee != null && existingFee.Status != InstallmentStatus.Paid)
                {
                    existingFee.InstallmentNumber = feeRequest.InstallmentNumber;
                    existingFee.DueDate = feeRequest.DueDate;
                    existingFee.Amount = feeRequest.Amount;
                    existingFee.AmountReceived = feeRequest.AmountReceived;
                    existingFee.DueAmount = feeRequest.DueAmount;
                    existingFee.CurrentReceivedAmount = feeRequest.CurrentReceivedAmount;
                    existingFee.AmountReceivedDate = feeRequest.AmountReceivedDate;
                    existingFee.PaymentMode = feeRequest.PaymentMode;
                    existingFee.Status = feeRequest.Status;
                    existingFee.Remarks = feeRequest.Remarks;

                }

                totalCurrentReceivedAmount = (double)(totalCurrentReceivedAmount + feeRequest.CurrentReceivedAmount);
                if (feeRequest.CurrentReceivedAmount > 0)
                {
                    transRemark = transRemark + feeRequest.Remarks + ",";
                }


            }

            if (totalCurrentReceivedAmount > 0)  // only log when payment is received
            {

                var feeStructure = await _context.FeeStructures
                          .Where(fs => fs.InstallmentId == feeStructureId).FirstOrDefaultAsync();
                var transaction = new Models.Transaction
                {
                    StudentId = feeStructure.StudentId,
                    TransactionAmount = totalCurrentReceivedAmount,
                    Status = TransactionMode.Credit,   // Payment = Credit
                    Remark = "Course Fee",
                    TransactionDate = DateTime.Now
                };

                await _context.Transactions.AddAsync(transaction);
            }

            await _context.SaveChangesAsync();

            return existingFees;
        }



        public async Task<string> GenerateStudentIdAsync()
        {
            // Get last StudentId from DB
            var lastStudent = await _context.StudentProfiles
                .OrderByDescending(s => s.StudentReferenceId)
                .FirstOrDefaultAsync();

            int nextNumber = 1;

            if (lastStudent != null)
            {
                // Extract numeric part from "AT001"
                string lastId = lastStudent.StudentReferenceId.Replace("AT", "");
                if (int.TryParse(lastId, out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            // Format: AT001, AT002, ...
            return $"AT{nextNumber:D3}";
        }

        //ADDED
        public async Task<SecondaryContact> AddSecondaryContactAsync(SecondaryContact contact)
        {
            _context.SecondaryContacts.Add(contact);
            await _context.SaveChangesAsync();
            return contact;
        }


        public async Task<SecondaryContact?> GetSecondaryContactByStudentIdAsync(Guid studentId)
        {
            return await _context.SecondaryContacts
                .Include(c => c.StudentProfile)
                .FirstOrDefaultAsync(c => c.StudentId == studentId);
        }

        public async Task<SecondaryContact?> UpdateSecondaryContactAsync(SecondaryContact contact)
        {
            var existing = await _context.SecondaryContacts.FirstOrDefaultAsync(c => c.StudentId == contact.StudentId);
            if (existing == null)
                return null;

            existing.GuardianName = contact.GuardianName;
            existing.Relation = contact.Relation;
            existing.Phone = contact.Phone;
            existing.Adress = contact.Adress;

            await _context.SaveChangesAsync();
            return existing;
        }


    }
}
