

﻿using AutoMapper;
using Domain.Enums;


using Domain.Exceptions;


using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Transactions;

namespace Domain.Services.Admin
{
    public class StudentProfileService : IStudentProfileService
    {
        private readonly IStudentProfileRepository _studentProfileRepository;
        private readonly ICollegeRepository _collegeRepository;
        private readonly IMapper _mapper;
        private readonly StudentManagementDbContext _studentManagementDbContext;
        private readonly ITransactionRepository _transactionRepo;
      
        public StudentProfileService(IStudentProfileRepository studentProfileRepository, ICollegeRepository collegeRepository, IMapper mapper, StudentManagementDbContext studentManagementDbContext, ITransactionRepository transactionrepo)
        {
            _studentProfileRepository = studentProfileRepository;
            _collegeRepository = collegeRepository;
            _mapper = mapper;
            _studentManagementDbContext = studentManagementDbContext;
            _transactionRepo = transactionrepo;
           
        }

        public async Task<CourseDetailDTO> AddCourseDetails(CourseDetailDTO newCourseDetails)
        {
            var courseEntity = _mapper.Map<CourseDetails>(newCourseDetails);

            // Save to repository and get saved entity
            var savedEntity = await _studentProfileRepository.AddCourseDetails(courseEntity);

            // Map saved entity back to DTO
            var courseDto = _mapper.Map<CourseDetailDTO>(savedEntity);

            return courseDto;
        }
        public async Task<List<CourseDetailDTO>> GetCourseDetailsByStudentId(string studentProfileId)
        {
            if (string.IsNullOrWhiteSpace(studentProfileId))
                throw new ArgumentException("studentProfileId cannot be null or empty.", nameof(studentProfileId));

            var courseDetails = await _studentProfileRepository.GetCourseDetailsByStudentId(studentProfileId);
            return _mapper.Map<List<CourseDetailDTO>>(courseDetails);
        }
        public async Task<List<FeeStructureDTO>> GetFeeStructuresByStudentId(string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("studentId cannot be null or empty.", nameof(studentId));

            var feeStructures = await _studentProfileRepository.GetFeeStructuresByStudentId(studentId);
            var feeStructureDTOs = _mapper.Map<List<FeeStructureDTO>>(feeStructures);

            // Validate that all FeeStructureDTOs have an InstallmentId
            foreach (var feeStructure in feeStructureDTOs)
            {
                if (feeStructure.InstallmentId == Guid.Empty)
                    throw new InvalidOperationException($"FeeStructure for studentId {studentId} has an empty InstallmentId.");
            }
            return feeStructureDTOs;
        }
        public async Task<List<QualificationDTO>> GetQualificationsByStudentId(string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("studentId cannot be null or empty.", nameof(studentId));

            var qualifications = await _studentProfileRepository.GetQualificationsByStudentId(studentId);
            return _mapper.Map<List<QualificationDTO>>(qualifications);
        }
        public async Task<List<ExperienceDTO>> GetExperiencesByStudentId(string studentId)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("studentId cannot be null or empty.", nameof(studentId));

            var experiences = await _studentProfileRepository.GetExperiencesByStudentId(studentId);
            return _mapper.Map<List<ExperienceDTO>>(experiences);
        }
        public async Task AddExperience(ExperienceDTO newExperience)
        {
            Experience exp = _mapper.Map<Experience>(newExperience);
            await _studentProfileRepository.AddExperience(exp);

        }

        public async Task AddFee(List<FeeDTO> newFee)
        {
            var feeEntities = _mapper.Map<List<Fee>>(newFee);
            await _studentProfileRepository.AddFee(feeEntities);
           // If you also want to create transactions for each fee payment:
            //foreach (var fee in feeEntities)
            //    {
            //        if (fee.AmountReceived > 0 && fee.InstallmentNumber>1)
            //        {
            //            var transaction = new Models.Transaction
            //            {
            //                StudentId = fee.FeeStructure.StudentId,
            //                TransactionAmount = fee.AmountReceived.Value,
            //                Status = TransactionMode.Credit,
            //                Remark = $"Fee Payment (Installment {fee.InstallmentNumber})",
            //                TransactionDate = DateTime.Now
            //            };

            //            await _transactionRepo.AddTransaction(transaction);
            //        }
            //    }
        }
        //public async Task AddMoreCourseFee(List<FeeDTO> newFee)
        //{
        //    var feeEntities=_mapper.Map<List<Fee>>(newFee);
        //    await _studentProfileRepository.AddMoreCourseFee(feeEntities);
        //}
        public async Task<FeeStructureDTO> AddFeeStructure(FeeStructureDTO newFeeStructure)
        {
            if (newFeeStructure == null)
                throw new ArgumentNullException(nameof(newFeeStructure));

            var feeStructure = _mapper.Map<FeeStructure>(newFeeStructure);
            // Ensure InstallmentId is set
            if (feeStructure.InstallmentId == Guid.Empty)
                feeStructure.InstallmentId = Guid.NewGuid();

            var feeStruct = await _studentProfileRepository.AddFeeStructure(feeStructure);
            return _mapper.Map<FeeStructureDTO>(feeStruct);

        }

        public async Task<QualificationDTO> AddQualification(QualificationDTO newQualification)
        {
            try {
                var quali = _mapper.Map<Qualification>(newQualification);
                newQualification.QualificationId = Guid.NewGuid();
                await _studentProfileRepository.AddQualification(quali);
                var qualificationentity = _mapper.Map<QualificationDTO>(quali);
                return qualificationentity;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error adding student profile", ex);
            }
        }



        //public async Task<StudentProfileDTO> AddStudentProfile(StudentProfileDTO newStudent)
        //{
        //    try
        //    {
        //        var profile = _mapper.Map<StudentProfile>(newStudent);
        //        newStudent.StudentId = Guid.NewGuid();
        //        await _studentProfileRepository.AddStudentProfile(profile);
        //        var resultDto = _mapper.Map<StudentProfileDTO>(profile);

        //        return resultDto;


        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException("Error adding student profile", ex);
        //    }
        //}

        //CHANGEDADDED
        public async Task<StudentProfileDTO> AddStudentProfile(StudentProfileDTO newStudent)
        {
            try
            {
                // FIX — assign ID before mapping
                newStudent.StudentId = Guid.NewGuid();

                var profile = _mapper.Map<StudentProfile>(newStudent);

                await _studentProfileRepository.AddStudentProfile(profile);

                var resultDto = _mapper.Map<StudentProfileDTO>(profile);
                return resultDto;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Error adding student profile", ex);
            }
        }



        //public async Task<StudentProfileDTO> AddStudentProfile(StudentProfileDTO newStudent)
        //{
        //    try
        //    {
        //        var profile = _mapper.Map<StudentProfile>(newStudent);
        //        newStudent.StudentId = Guid.NewGuid();
        //        await _studentProfileRepository.AddStudentProfile(profile);
        //        var resultDto = _mapper.Map<StudentProfileDTO>(profile);


        //        return resultDto;


        //    }
        //    catch (Exception ex)
        //    {
        //        throw new ApplicationException("Error adding student profile", ex);
        //    }
        //}

        //try
        //{
        //    // Assign new StudentId
        //    newStudent.StudentId = Guid.NewGuid();

        //    // Case 1: Direct Enrollment
        //    if (newStudent.EnrollmentType == EnrollmentType.Direct)
        //    {
        //        newStudent.TrialStudentId = null;
        //        // Use data as-is from DTO
        //    }
        //    // Case 2: Enrollment from Trial
        //    else
        //    {
        //        if (!newStudent.TrialStudentId.HasValue)
        //            throw new ArgumentException("TrialStudentId is required for trial-based enrollment.");

        //        // Fetch TrialStudent from DB
        //        var trial = await _studentManagementDbContext.TrialStudents.FindAsync(newStudent.TrialStudentId.Value);
        //        if (trial == null)
        //            throw new Exception("Trial student not found.");

        //        // Override DTO fields with trial values
        //        newStudent.FirstName = trial.FirstName;
        //        newStudent.LastName = trial.LastName;
        //        newStudent.Email = trial.Email;
        //        newStudent.Phone = trial.Phone;
        //        newStudent.Address = trial.Address;
        //    }

        //    // Map to domain entity
        //    var profile = _mapper.Map<StudentProfile>(newStudent);

        //    // Save to DB
        //    var createdProfile = await _studentProfileRepository.AddStudentProfile(profile);

        //    // Map back to DTO
        //    return _mapper.Map<StudentProfileDTO>(createdProfile);
        //}
        //catch (Exception ex)
        //{
        //    throw new ApplicationException("Error adding student profile", ex);
        //}
        //}

        public async Task<bool> DeleteCourseDetails(Guid id)
        {
            try
            {
                var deleted = await _studentProfileRepository.DeleteCourseDetails(id);

                if (!deleted)
                {
                    throw new KeyNotFoundException($"CourseDetail with ID {id} not found.");
                }

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting course details", ex);
            }
        }

        public async Task<bool> DeleteExperience(Guid id)

        {
            try
            {
                var deleteexp = await _studentProfileRepository.DeleteExperience(id);
                if (!deleteexp)
                {
                    throw new KeyNotFoundException("Experience not found or already deleted");
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occured while delete experience",ex);
            }
        }


        public async Task<bool> DeleteFee(Guid feeId)

        {
            return await _studentProfileRepository.DeleteFee(feeId);
        }

        public async Task<bool> DeleteFeeStructure(Guid id)
        {
             return await _studentProfileRepository.DeleteFeeStructure(id);
            
        }

        public async Task<bool> DeleteQualification(Guid id)
        {
            try
            {
                var delete = await _studentProfileRepository.DeleteQualification(id);
                if (!delete)
                {
                    throw new KeyNotFoundException("Qualification not found or already deleted");
                }
                return true;
            }
            catch (Exception ex)
            {

                throw new ApplicationException("An error occured while deleting the qualification", ex);
            }
        }
        

        public async Task<bool> DeleteStudentProfile(Guid id)
        {
            try
            {
                var deleteProfile = await _studentProfileRepository.DeleteStudentProfile(id);
                if (!deleteProfile)
                {
                    throw new KeyNotFoundException("Student Profile not found or already deleted");
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occured while delete StudentProfile", ex);
            }
        }

        public async Task<List<CourseDetailDTO>> GetAllCourseDetails()
        {
            var courses = await _studentProfileRepository.GetAllCourseDetails();
            return _mapper.Map<List<CourseDetailDTO>>(courses);
        }

        public async Task<List<ExperienceDTO>> GetAllExperience()
        {
            var expList = await _studentProfileRepository.GetAllExperience();
            var experiences = _mapper.Map<List<ExperienceDTO>>(expList);    
            return experiences;
        }

        public async Task<List<FeeDTO>> GetAllFee(Guid feeStructureId)
        {
           var fee=await _studentProfileRepository.GetAllFee(feeStructureId);
            var fees=_mapper.Map<List<FeeDTO>>(fee);
            return fees;
        }

        public async Task<List<FeeStructureDTO>> GetAllFeeStructure()
        {
            var AllFeeStructures=await _studentProfileRepository.GetAllFeeStructure();
            var feeStructures=_mapper.Map<List<FeeStructureDTO>>(AllFeeStructures);
            return feeStructures;

        }

        public async Task<List<QualificationDTO>> GetAllQualifications()
        {
            var qualifList = await _studentProfileRepository.GetAllQualifications();
            var qualifications = _mapper.Map<List<QualificationDTO>>(qualifList)
                ;
            return qualifications;
        }


        public async Task<List<StudentProfileDTO>> GetAllStudentProfiles()
        {
            var profiles = await _studentProfileRepository.GetAllStudentProfiles();
            return _mapper.Map<List<StudentProfileDTO>>(profiles);
        }

        public async Task<CourseDetailDTO> GetCourseDetailsById(Guid courseId)
        {
            var course = await _studentProfileRepository.GetCourseDetailsById(courseId);
            return _mapper.Map<CourseDetailDTO>(course)
                ;
        }


        public async Task<ExperienceDTO> GetExperienceById(Guid id)

       

        {
            var exp = await _studentProfileRepository.GetExperienceById(id);
            var expId = _mapper.Map<ExperienceDTO>(exp);
            return expId;
        }

        public async Task<FeeDTO> GetFeeById(Guid feeId)
        {
            var fee=await _studentProfileRepository.GetFeeById(feeId);
            var fees=_mapper.Map<FeeDTO>(fee);
            return fees;
        }

        public async Task<FeeStructureDTO> GetFeeStructureById(Guid id)
        {
           var feeStructure=await _studentProfileRepository.GetFeeStructureById(id);
           var structure=_mapper.Map<FeeStructureDTO>(feeStructure);
            return structure;
        }

        public async Task<QualificationDTO> GetQualificationById(Guid id)
        {
            var quali = await _studentProfileRepository.GetQualificationById(id);
            var qualifiId = _mapper.Map<QualificationDTO>(quali);
            return qualifiId;
        }

        public async Task<StudentProfileDTO> GetStudentProfileById(Guid id)
        {
            var profile = await _studentProfileRepository.GetStudentProfileById(id);
            return profile == null ? null : _mapper.Map<StudentProfileDTO>(profile);
        }

        public async Task<FeeDTO> UpdateFee(Guid feeId, FeeDTO fee)
        {
            var fees=await _studentProfileRepository.GetFeeById(feeId);
            if (fees != null)
            {
                fees.FeeStructureId = fee.FeeStructureId != Guid.Empty ? fee.FeeStructureId : fees.FeeStructureId;
                fees.DueDate = fee.DueDate != default ? fee.DueDate : fees.DueDate;
                fees.Amount=fee.Amount != null ? fee.Amount : fees.Amount;
                fees.Status = Enum.IsDefined(typeof(FeeStatus), fee.Status) ? fee.Status : fees.Status;
                var newFee=await _studentProfileRepository.UpdateFee(fees);

                
                return _mapper.Map<FeeDTO>(newFee);
            }
            else
            {
                return null;
            }
        }


        public async Task<List<StudentProfileDTO>> SearchByName(string name)


        {
            var profiles = await _studentProfileRepository.SearchByName(name);
            return profiles == null ? null : _mapper.Map<List<StudentProfileDTO>>(profiles);
        }

        public async Task<List<CourseDetailDTO>> SearchCourseDetails(string name)
        {
            var courses = await _studentProfileRepository.SearchCourseDetails(name);
            return _mapper.Map<List<CourseDetailDTO>>(courses);
        }

        public async Task<List<ExperienceDTO>> SearchExperience(string name)
        {
           var exp  = await _studentProfileRepository.SearchExperience(name);
            var expname = _mapper.Map<List<ExperienceDTO>>(exp);
            return expname;
        }

        public async Task<List<TodayPendingFeeDTO>> SearchFee(DateOnly dueDate)
        {
            return await _studentProfileRepository.SearchFee(dueDate);
            
        }

        public async Task<List<FeeStructureDTO>> SearchFeeStructure(string name)
        {
            var fee=await _studentProfileRepository.SearchFeeStructure(name);
            var feeStructure=_mapper.Map<List<FeeStructureDTO>>(fee);
            return feeStructure;
        }

        public async Task<List<QualificationDTO>> SearchQualification(string name)
        {
            var quali = await _studentProfileRepository.SearchQualification(name);
            var qualiname = _mapper.Map<List<QualificationDTO>>(quali);
            return qualiname;
        }

        public async Task<CourseDetailDTO> UpdateCourseDetails(Guid id, CourseDetailDTO courseDetails)
        {
            var existing = await _studentProfileRepository.GetCourseDetailsById(id);
            if (existing == null)
            {
                throw new Exception("Course details not found for update.");
            }

            // Update all properties, respecting DTO values without restrictive conditions
            existing.StudentProfileId = courseDetails.StudentProfileId != Guid.Empty ? courseDetails.StudentProfileId : existing.StudentProfileId;
            existing.CourseId = courseDetails.CourseId != Guid.Empty ? courseDetails.CourseId : existing.CourseId;
            existing.BatchId = courseDetails.BatchId != Guid.Empty ? courseDetails.BatchId : existing.BatchId;
            existing.TimeSlot = string.IsNullOrEmpty(courseDetails.TimeSlot) ? existing.TimeSlot : courseDetails.TimeSlot;
            existing.Status = courseDetails.Status; // Directly assign, as enums can be 0
            existing.Mode = courseDetails.Mode; // Directly assign, as enums can be 0

            var updated = await _studentProfileRepository.UpdateCourseDetails(id, existing);
            return _mapper.Map<CourseDetailDTO>(updated);
        }
        public async Task<ExperienceDTO> UpdateExperience(Guid id, ExperienceDTO experience)
        {
            try
            {
                var existingExp = await _studentProfileRepository.GetExperienceById(id);
                if (existingExp == null)
                {
                    throw new InvalidOperationException("Experience not found");


                }
                existingExp.CompanyName = string.IsNullOrWhiteSpace(experience.CompanyName) ? existingExp.CompanyName : experience.CompanyName;
                existingExp.Position = string.IsNullOrWhiteSpace(experience.Position) ? existingExp.Position : experience.Position;
                existingExp.TotalExperience = string.IsNullOrWhiteSpace(experience.TotalExperience) ? existingExp.TotalExperience : experience.TotalExperience;

                var result = await _studentProfileRepository.UpdateExperience(existingExp);
                return _mapper.Map<ExperienceDTO>(result);
            }

            catch (KeyNotFoundException ex)
            {
                throw new InvalidOperationException("Experience not found in the database.", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while updating the experience with ID {id}.", ex);
            }
        }
   

        public async Task<FeeStructureDTO> UpdateFeeStructure(Guid id, FeeStructureDTO feeStructure)

        {
            var existing=await _studentProfileRepository.GetFeeStructureById(id);
            if (existing == null)
            {
                throw new ItemNotFoundException("Not Found.");
            }
            existing.StudentId = feeStructure.StudentId != Guid.Empty ? feeStructure.StudentId : existing.StudentId;
            existing.CourseDetailId = feeStructure.CourseDetailId != Guid.Empty ? feeStructure.CourseDetailId : existing.CourseDetailId;
            existing.TotalInstallment = feeStructure.TotalInstallment > 0 ? feeStructure.TotalInstallment : existing.TotalInstallment;

            var updatedFee=await _studentProfileRepository.UpdateFeeStructure(existing);
            return _mapper.Map<FeeStructureDTO>(updatedFee);

        }

        public async Task<QualificationDTO> UpdateQualification(Guid id, QualificationDTO qualification)
        {
            try
            {
                var existingQuali = await _studentProfileRepository.GetQualificationById(id);
                if (existingQuali == null)
                {
                    throw new InvalidOperationException("Qualification not found");
                }

                existingQuali.QualificationName = string.IsNullOrWhiteSpace(qualification.QualificationName)
                    ? existingQuali.QualificationName
                    : qualification.QualificationName;

                // Validate PassOutYear as a four-digit year string
                if (Regex.IsMatch(qualification.PassOutYear, @"^\d{4}$") &&
                    int.Parse(qualification.PassOutYear) >= 1900 &&
                    int.Parse(qualification.PassOutYear) <= DateTime.Now.Year + 1)
                {
                    existingQuali.PassOutYear = qualification.PassOutYear;
                }
                else
                {
                    existingQuali.PassOutYear = existingQuali.PassOutYear; // Keep existing if invalid
                }

                existingQuali.CollegeId = qualification.CollegeId != Guid.Empty
                    ? qualification.CollegeId
                    : existingQuali.CollegeId;

                var updatedQuali = await _studentProfileRepository.UpdateQualification(existingQuali);
                var resultDto = _mapper.Map<QualificationDTO>(updatedQuali);
                // Populate CollegeName for response
                if (updatedQuali.College != null)
                {
                    resultDto.CollegeName = updatedQuali.College.CollegeName;
                }
                return resultDto;
            }
            catch (KeyNotFoundException ex)
            {
                throw new InvalidOperationException("Qualification not found in the database.", ex);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred while updating the qualification with ID {id}.", ex);
            }
        }

        public async Task<StudentProfileDTO> UpdateStudentProfile(Guid id, StudentProfileDTO student)
        {
            try
            {
                var existingProfile = await _studentProfileRepository.GetStudentProfileById(id);
                if (existingProfile == null)
                {
                    throw new KeyNotFoundException("Student profile not found");
                }


                existingProfile.TrialStudentId = student.TrialStudentId != Guid.Empty ? student.TrialStudentId : existingProfile.TrialStudentId;
                existingProfile.ReferredBy = student.ReferredBy != 0 ? student.ReferredBy : existingProfile.ReferredBy;
                existingProfile.DOB = !student.DOB.Equals(DateTime.MinValue) ? student.DOB : existingProfile.DOB;
                existingProfile.FirstName = !string.IsNullOrWhiteSpace(student.FirstName) ? student.FirstName : existingProfile.FirstName;
                existingProfile.LastName = !string.IsNullOrWhiteSpace(student.LastName) ? student.LastName : existingProfile.LastName;
                existingProfile.Email = !string.IsNullOrWhiteSpace(student.Email) ? student.Email : existingProfile.Email;
                existingProfile.Phone = !string.IsNullOrWhiteSpace(student.Phone) ? student.Phone : existingProfile.Phone;
                existingProfile.Address = !string.IsNullOrWhiteSpace(student.Address) ? student.Address : existingProfile.Address;

               


                await _studentProfileRepository.UpdateStudentProfile(existingProfile);
                

                return _mapper.Map<StudentProfileDTO>(existingProfile);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("An error occurred while updating the student profile", ex);
            }
        }

        public async Task<StudentProfile> UploadDocument(Guid StudentId, byte[] file)
        {

            var student = await _studentProfileRepository.UploadDocument(StudentId, file);
            return student;
        }

        public async Task<byte[]> GetDocumentByStudentId(Guid studentId)
        {
            var document = await _studentProfileRepository.GetDocumentByStudentId(studentId);
            return document;
        }

        public async Task<List<FeeDTO>> SearchFeeByRange(DateOnly startDate, DateOnly endDate, InstallmentStatus? status)
        {
            var fees=await _studentProfileRepository.SearchFeeByRange(startDate, endDate,status);
            var feeList=_mapper.Map<List<FeeDTO>>(fees);
            return feeList;
        }

        public async Task<List<FeeDTO>> GetAllFees()
        {
            var fees=await _studentProfileRepository.GetAllFees();
            var feeList=_mapper.Map<List<FeeDTO>>(fees);
            return feeList;
        }
        public async Task<List<FeeDTO>> GetFeesByFeeStructureId(string feeStructureId)
        {
            if (string.IsNullOrWhiteSpace(feeStructureId))
                throw new ArgumentException("feeStructureId cannot be null or empty.", nameof(feeStructureId));

            if (!Guid.TryParse(feeStructureId, out var parsedFeeStructureId))
                throw new ArgumentException("feeStructureId must be a valid GUID.", nameof(feeStructureId));

            if (parsedFeeStructureId == Guid.Empty)
                throw new ArgumentException("feeStructureId cannot be an empty GUID.", nameof(feeStructureId));

            var fees = await _studentProfileRepository.GetFeesByFeeStructureId(feeStructureId);
            return _mapper.Map<List<FeeDTO>>(fees);
        }

        public async Task<List<FeeDTO>> UpdateFeeByFeeStructureId(Guid feeStructureId, List<FeeDTO> feeRequests)
        {
            var newFeeRequest=_mapper.Map<List<Fee>>(feeRequests);
            var updateFees =await _studentProfileRepository.UpdateFeeByFeeStructureId(feeStructureId, newFeeRequest);
             //✅ Insert a new Transaction
            var feeStructure = _studentManagementDbContext.FeeStructures
                .Where(fs => fs.InstallmentId == feeStructureId).FirstOrDefault();
            if (feeStructure != null)
            {
                foreach (var feeDto in feeRequests)
                {
                    if (feeDto.AmountReceived > 0)  // only log when payment is received
                    {
                        var transaction = new Models.Transaction
                        {
                            StudentId = feeStructure.StudentId,
                            TransactionAmount = feeDto.CurrentReceivedAmount ?? 0,
                            Status = TransactionMode.Credit,   // Payment = Credit
                            Remark = feeDto.Remarks ?? "Fee Payment",
                            TransactionDate = DateTime.Now
                        };

                        await _transactionRepo.AddTransaction(transaction);
                    }
                }
            }
                return _mapper.Map<List<FeeDTO>>(updateFees);
        }

        public async Task<List<FeeDTO>> UpdateFeeByFeeStructureIdAllocation(Guid feeStructureId, List<FeeDTO> feeRequests)
        {
           var newFeeRequest=_mapper.Map<List<Fee>>(feeRequests);
            var updateFees = await _studentProfileRepository.UpdateFeeByFeeStructureIdAllocation(feeStructureId, newFeeRequest);
            return _mapper.Map<List<FeeDTO>>(updateFees);
        }


        //CHANGED
        public async Task<List<FeesDTO>> GetFeesByStudentId(Guid studentId)
        {
            var fees = await _studentManagementDbContext.Fees
                .Include(f => f.FeeStructure)
                    .ThenInclude(fs => fs.CourseDetail)
                        .ThenInclude(cd => cd.Course)
                .Include(f => f.FeeStructure)
                    .ThenInclude(fs => fs.StudentProfile)
                        .ThenInclude(sp => sp.TrialStudent)
                .Where(f => f.FeeStructure.StudentId == studentId)
                .Select(f => new FeesDTO
                {
                    FeeId = f.FeeId,
                    InstallmentNumber = f.InstallmentNumber,
                    DueDate = f.DueDate,
                    Amount = f.Amount,
                    AmountReceived = f.AmountReceived,
                    DueAmount = f.DueAmount,
                    Status = f.Status,
                    CourseName = f.FeeStructure.CourseDetail.Course.CourseName,

                    
                    StudentName = f.FeeStructure.StudentProfile.TrialStudent.FirstName + " " +
                                  f.FeeStructure.StudentProfile.TrialStudent.LastName,
                    //StudentId =f.FeeStructure.StudentId  //added
                })
                .ToListAsync();

            return fees;
        }

        //added
        public async Task<SecondaryContactDto> AddSecondaryContactAsync(SecondaryContactDto dto)
        {
            // ignore incoming ID and always create new one
            var entity = _mapper.Map<SecondaryContact>(dto);
            entity.SecondaryContactId = Guid.NewGuid();

            await _studentProfileRepository.AddSecondaryContactAsync(entity);
            return _mapper.Map<SecondaryContactDto>(entity);
        }


        public async Task<SecondaryContactDto?> GetSecondaryContactByStudentIdAsync(Guid studentId)
        {
            var contact = await _studentProfileRepository.GetSecondaryContactByStudentIdAsync(studentId);
            return contact == null ? null : _mapper.Map<SecondaryContactDto>(contact);
        }

        public async Task<SecondaryContactDto?> UpdateSecondaryContactAsync(SecondaryContactDto dto)
        {
            var entity = _mapper.Map<SecondaryContact>(dto);
            var updated = await _studentProfileRepository.UpdateSecondaryContactAsync(entity);
            return updated == null ? null : _mapper.Map<SecondaryContactDto>(updated);
        }

    }
}
