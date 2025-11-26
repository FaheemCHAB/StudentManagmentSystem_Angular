using AutoMapper;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.API.Admin.RequestObjects;
using StudentManagement.Controllers;
using StudentManagement.API.Admin.RequestObjects;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Domain.Services.Admin;
using Microsoft.AspNetCore.Hosting;

namespace StudentManagement.API.Admin
{
    
    [ApiController]
    [Authorize]
    public class StudentProfileController : BaseAPIController<StudentProfileController>
    {
        private readonly ILogger<StudentProfileController> _logger;
        private readonly IStudentProfileService _studentProfileService;
        private readonly IMapper _mapper;
        private readonly ITrialStudentService _trialStudentService;
        private readonly IWebHostEnvironment _webHostEnvironment; //added
        private readonly IEmailService _emailService; //added
        public StudentProfileController(ILogger<StudentProfileController> logger, IStudentProfileService studentProfileService, IMapper mapper, ITrialStudentService trialStudentService, IWebHostEnvironment webHostEnvironment,IEmailService emailService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _studentProfileService = studentProfileService;

            _mapper = mapper;
            _trialStudentService = trialStudentService;
            _webHostEnvironment = webHostEnvironment;
            _emailService = emailService;
        }


        [HttpPost("qualifications")]
        public async Task<IActionResult> AddQualification(QualificationRequest qualificationRequest)
        {
            try
            {

                var newqualification = _mapper.Map<QualificationDTO>(qualificationRequest);

                await _studentProfileService.AddQualification(newqualification);
                return Ok(new { message = "Qualification added Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }
        [HttpPut("qualifications/{qualificationId}")]

        public async Task<IActionResult> UpdateQualification(Guid qualificationId, [FromBody] QualificationRequest qualificationRequest)
        {
            try
            {
                var updateQualification = _mapper.Map<QualificationDTO>(qualificationRequest);
                updateQualification.QualificationId = qualificationId;
                var result = await _studentProfileService.UpdateQualification(qualificationId, updateQualification);
                return Ok(new { message = "Qualification updated successfully", data = result });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating qualification with ID: {Id}", qualificationId);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("studentprofile")]
        public async Task<IActionResult> GetAllStudentProfiles()
        {
            try
            {
                var profiles = await _studentProfileService.GetAllStudentProfiles();
                return Ok(profiles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("studentprofile/{id}")]
        public async Task<IActionResult> GetStudentProfileById(Guid id)
        {
            try
            {
                var profile = await _studentProfileService.GetStudentProfileById(id);
                if (profile == null)
                    return NotFound("Student profile not found");
                return Ok(profile);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("qualifications/{qualificationid}")]
        public async Task<IActionResult> DeleteQualification(Guid qualificationid)
        {
            try
            {
                await _studentProfileService.DeleteQualification(qualificationid);
                return Ok(new { message = "Qualification deleted successfully" });
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpGet("qualifications/{qualificationId}")]
        public async Task<IActionResult> GetQualificationById(Guid qualificationId)
        {
            try
            {
                var qualification = await _studentProfileService.GetQualificationById(qualificationId);
                return Ok(qualification);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("studentprofile/name")]
        public async Task<IActionResult> GetStudentProfileByName([FromQuery] string name)
        {
            try
            {
                var profile = await _studentProfileService.SearchByName(name);
                if (profile == null)
                    return NotFound("Student profile not found by name");
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("studentprofile")]
        public async Task<IActionResult> AddStudentProfile([FromForm] StudentProfileRequest request)
        {
            try
            {
                string? photoUrl = null;

                if (request.PhotoFile != null && request.PhotoFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "studentPhotos");
                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(request.PhotoFile.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.PhotoFile.CopyToAsync(stream);
                    }

                   
                    var baseUrl = $"{Request.Scheme}://{Request.Host}";
                    photoUrl = $"{baseUrl}/uploads/studentPhotos/{uniqueFileName}";
                }

               
                var dto = _mapper.Map<StudentProfileDTO>(request);
                dto.PhotoUrl = photoUrl;

                var newProfile = await _studentProfileService.AddStudentProfile(dto);

                if (!string.IsNullOrEmpty(newProfile.Email))  
                {
                    await _emailService.SendEmailAsync(new EmailDto
                    {
                        To = newProfile.Email,
                        Subject = "Welcome to Aitrich Academy!",
                        Body = $@"
                        <h2>Hello {newProfile.FirstName} {newProfile.LastName},</h2>
                        <p>Your student registration is successful!</p>
                         <p><strong>Your Student Reference ID:</strong> {newProfile.StudentReferenceId}</p>
                        <p>We are happy to have you at Aitrich.</p>
                        <br/>"
                    });
                }


                return Ok(new
                {
                    studentId = newProfile.StudentId,
                    photoUrl = newProfile.PhotoUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }
        
    





[HttpGet("qualifications")]
        public async Task<IActionResult> GetAllQualifications()
        {
            try
            {
                var quali = await _studentProfileService.GetAllQualifications();
                return Ok(quali);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("studentprofile/{id}")]
        public async Task<IActionResult> UpdateStudentProfile(Guid id, [FromBody] StudentProfileRequest studentProfileRequest)
        {
            try
            {
                var dto = _mapper.Map<StudentProfileDTO>(studentProfileRequest);

                await _studentProfileService.UpdateStudentProfile(id, dto);
                return Ok(new { message = "Student profile updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Student profile not found");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        [HttpGet("experiences")]
        public async Task<IActionResult> GetallExperiences()
        {
            try
            {
                var exp = await _studentProfileService.GetAllExperience();
                return Ok(exp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpDelete("studentprofile/{id}")]
        public async Task<IActionResult> DeleteStudentProfile(Guid id)
        {
            try
            {
                await _studentProfileService.DeleteStudentProfile(id);
                return Ok(new { message = "Student profile Deleted" });
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("experiences/{id}")]
        public async Task<IActionResult> GetExperienceById(Guid id)
        {
            try
            {
                var exp = await _studentProfileService.GetExperienceById(id);
                return Ok(exp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("experiences")]
        public async Task<IActionResult> AddExperience([FromBody] ExperienceRequest request)
        {
            try
            {

                var addexp = _mapper.Map<ExperienceDTO>(request);
                await _studentProfileService.AddExperience(addexp);
                return Ok(new { message = "Experience added Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });

            }
        }
        [HttpPut("experiences/{expid}")]
        public async Task<IActionResult> UpdateExperience(Guid expid, [FromBody] ExperienceRequest request)
        {
            try
            {
                var exp = _mapper.Map<ExperienceDTO>(request);
                await _studentProfileService.UpdateExperience(expid, exp);
                return Ok(new { message = "Experience updated Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("experiences/{expid}")]
        public async Task<IActionResult> DeleteExperience(Guid expid)
        {
            try
            {
                await _studentProfileService.DeleteExperience(expid);
                return Ok(new { message = "Deleted Experience" });
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(ex.Message);
            }

        }



        [HttpPost("upload-student-document")]

        public async Task<IActionResult> UploadStudentDocument(Guid StudentId, [FromForm] DocumentUploadRequest request)
        {
            using var ms = new MemoryStream();
            await request.File.CopyToAsync(ms);
            var fileBytes = ms.ToArray();


            //var DocumentDto = new DocumentDto
            //{

            //    Title = request.Title,
            //    File = fileBytes
            //};


            await _studentProfileService.UploadDocument(StudentId, fileBytes);
            return Ok("Resume uploaded successfully.");
        }

        [HttpGet("GetDocument/{studentId}")]
        public async Task<IActionResult> GetDocumentByStudentId(Guid studentId)
        {
            var document = await _studentProfileService.GetDocumentByStudentId(studentId);
            if (document == null) return NotFound("Document not found");

            return File(document, "application/octet-stream", $"{document}.pdf");
        }

        [HttpGet("courseDetails/{id}")]
        public async Task<IActionResult> GetCourseDetailsById(Guid id)
        {
            try
            {
                var result = await _studentProfileService.GetCourseDetailsById(id);
                if (result == null)
                    return NotFound("Course detail not found.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpGet("CourseDetails")]
        public async Task<IActionResult> GetAllCourseDetails()
        {
            try
            {
                var result = await _studentProfileService.GetAllCourseDetails();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }


        }

        [HttpGet("CourseDetailsName")]
        public async Task<IActionResult> GetCourseDetailsByCourseName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Course name is required.");

            try
            {
                var results = await _studentProfileService.SearchCourseDetails(name);
                if (results == null || !results.Any())
                    return NotFound("No course details found for the given course name.");
                
                var mappedResults = _mapper.Map<IEnumerable<CourseDetailRequest>>(results);
                return Ok(mappedResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CourseDetails")]
        public async Task<IActionResult> AddCourseDetail([FromBody] CourseDetailRequest dto)
        {
            try
            {
                var newCourseDetais = _mapper.Map<CourseDetailDTO>(dto);
                var addedCourse = await _studentProfileService.AddCourseDetails(newCourseDetais);
                return Ok(addedCourse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPut("CourseDetails/{id}")]
        public async Task<IActionResult> UpdateCourseDetails(Guid id, [FromBody] CourseDetailRequest dto)
        {
            try
            {
                var courseDetailDto = new CourseDetailDTO
                {
                    CourseDetailId = id,
                    StudentProfileId = dto.StudentProfileId,
                    CourseId = dto.CourseId,
                    BatchId = dto.BatchId,
                    TimeSlot = dto.TimeSlot,
                    Status = dto.Status,
                    Mode = dto.Mode
                };

                var updated = await _studentProfileService.UpdateCourseDetails(id, courseDetailDto);
                return Ok(updated); // Return the updated DTO from the service
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating CourseDetails with ID: {Id}", id);
                return StatusCode(500, "An error occurred while saving the entity changes. See logs for details.");
            }
        }

        [HttpDelete("CourseDetails/{id}")]
        public async Task<IActionResult> DeleteCourseDetail(Guid id)
        {
            try
            {
                var deleted = await _studentProfileService.DeleteCourseDetails(id);
                if (!deleted)
                    return NotFound("Course detail not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpGet("feeStructure")]
        public async Task<IActionResult> GetAllFeeStructure()
        {
            try
            {
                var feeStructures = await _studentProfileService.GetAllFeeStructure();
                if (feeStructures == null)
                {
                    throw new ItemNotFoundException("No fee  structure available");
                }
                return Ok(feeStructures);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("feeStructure/{feeStructureId:guid}")]
        public async Task<IActionResult> GetFeeStructureById(Guid feeStructureId)
        {
            try
            {
                var feeStructure = await _studentProfileService.GetFeeStructureById(feeStructureId);
                if (feeStructure == null)
                {
                    throw new ItemNotFoundException("No fee  structure available");
                }
                return Ok(feeStructure);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("feeStructure/{name}")]
        public async Task<IActionResult> GetFeeStructureByStudentName(string name)
        {
            var feeStructure = await _studentProfileService.SearchFeeStructure(name);
            if (feeStructure == null)
            {
                throw new ItemNotFoundException("No fee  structure available");
            }
            return Ok(feeStructure);
        }

        [HttpPost("feeStructure")]
        public async Task<IActionResult> AddFeeStructure(FeeStructureRequest feeStructure)
        {
            try
            {
                var newFeeStructure = _mapper.Map<FeeStructureDTO>(feeStructure);
                var feeStruct = await _studentProfileService.AddFeeStructure(newFeeStructure);
                return Ok(feeStruct);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("feeStructure/{feeStructureId:guid}")]
        public async Task<IActionResult> UpdateFeeStructure(Guid feeStructureId, FeeStructureRequest feeStructure)
        {
            try
            {
                var updateFeeStructure = _mapper.Map<FeeStructureDTO>(feeStructure);
                await _studentProfileService.UpdateFeeStructure(feeStructureId, updateFeeStructure);
                return Ok(updateFeeStructure);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("feeStructure/{feeStructureId:guid}")]
        public async Task<IActionResult> DeleteFeeStructure(Guid feeStructureId)
        {
            try
            {
                await _studentProfileService.DeleteFeeStructure(feeStructureId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("feeStructure/{feeStructureId:guid}/Fees")]
        public async Task<IActionResult> GetAllFee(Guid feeStructureId)
        {
            try
            {
                var fees = await _studentProfileService.GetAllFee(feeStructureId);
                if (fees == null)
                {
                    throw new ItemNotFoundException("No fee available");
                }
                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("fee/{feeId:guid}")]
        public async Task<IActionResult> GetFeeById(Guid feeId)
        {
            try
            {
                var fees = await _studentProfileService.GetFeeById(feeId);
                if (fees == null)
                {
                    throw new ItemNotFoundException("No fee available");
                }
                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("fee")]
        public async Task<IActionResult> GetFeeByRange(DateOnly startDate, DateOnly endDate, [FromQuery] InstallmentStatus? status)
        {
            try
            {
                var fees = await _studentProfileService.SearchFeeByRange(startDate, endDate, status);
                if (fees == null)
                {
                    throw new ItemNotFoundException("No fee available");
                }
                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("fee/date")]
        public async Task<IActionResult> GetFeeByDate()
        {
            try
            {
                DateOnly today = DateOnly.FromDateTime(DateTime.Today);
                var fees = await _studentProfileService.SearchFee(today);

                if (fees == null || !fees.Any())
                {
                    return NotFound("No pending fees found for today.");
                }

                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching today's fee data: {ex.Message}");
            }
        }


        [HttpGet("fees")]
        public async Task<IActionResult> GetAllFees()
        {
            try
            {
                var fees = await _studentProfileService.GetAllFees();
                if (fees == null)
                {
                    throw new ItemNotFoundException("No fees");
                }
                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("fee")]
        public async Task<IActionResult> AddFees(List<FeeRequest> fees)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var feeDTOs = _mapper.Map<List<FeeDTO>>(fees);
                await _studentProfileService.AddFee(feeDTOs);
                return Ok(feeDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[HttpPost("courseFeeList")]
        //public async Task<IActionResult> AddMoreCourseFee(List<FeeRequest> fees)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    try
        //    {
        //        var feeDTOs = _mapper.Map<List<FeeDTO>>(fees);
        //        await _studentProfileService.AddMoreCourseFee(feeDTOs);
        //        return Ok(feeDTOs);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPut("fee/{feeId:guid}")]
        public async Task<IActionResult> UpdateFee(Guid feeId, FeeRequest newFee)
        {
            try
            {
                var updateFee = _mapper.Map<FeeDTO>(newFee);
                await _studentProfileService.UpdateFee(feeId, updateFee);
                return Ok(newFee);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("feeList/{feeStructureId:guid}")]
        public async Task<IActionResult> UpdateFeeByFeeStructureId(Guid feeStructureId,List<FeeDTO> FeeDto)
        {
            try
            {

                //var updateFee=_mapper.Map<List<FeeDTO>>(feeRequests);
                var updatedFee= await _studentProfileService.UpdateFeeByFeeStructureId(feeStructureId,FeeDto);
                return Ok(updatedFee);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("feeList/{feeStructureId:guid}/allocation")]
        public async Task<IActionResult> UpdateFeeByFeeStructureIdAllocation(Guid feeStructureId, List<FeeDTO> FeeDto)
        {
            try
            {
                
                var updatedFee = await _studentProfileService.UpdateFeeByFeeStructureIdAllocation(feeStructureId, FeeDto);
                return Ok(updatedFee);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("fee/{feeId:guid}")]
        public async Task<IActionResult> DeleteFee(Guid feeId)
        {
            try
            {
                await _studentProfileService.DeleteFee(feeId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("qualificationname")]
        public async Task<IActionResult> SearchqualificationByName(string name)
        {
            try
            {
                var qauliname = await _studentProfileService.SearchQualification(name);
                if (qauliname == null)
                {
                    throw new ItemNotFoundException("Qualification not found");

                }
                return Ok(qauliname);

            }
            catch (Exception ex)
            {
                {
                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("experiencename")]
        public async Task<IActionResult> SearchExperienceByName(string name)
        {
            try
            {
                var expname = await _studentProfileService.SearchExperience(name);
                if (expname == null)
                {
                    throw new ItemNotFoundException("Experience not found");

                }
                return Ok(expname);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("qualifications/byStudentId")]
        public async Task<IActionResult> GetQualificationsByStudentId([FromQuery] string studentId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(studentId))
                    return BadRequest("studentId is required.");

                var qualifications = await _studentProfileService.GetQualificationsByStudentId(studentId);
                if (qualifications == null || !qualifications.Any())
                    return NotFound("No qualifications found for this student.");

                return Ok(qualifications);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // e.g., "studentId must be a valid GUID."
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while fetching qualifications.");
            }
        }


        [HttpGet("experiences/byStudentId")]
        public async Task<IActionResult> GetExperiencesByStudentId([FromQuery] string studentId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(studentId))
                    return BadRequest("studentId is required.");

                var experiences = await _studentProfileService.GetExperiencesByStudentId(studentId);
                if (experiences == null || !experiences.Any())
                    return NotFound("No experiences found for this student.");

                return Ok(experiences);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // e.g., "studentId must be a valid GUID."
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while fetching experiences.");
            }
        }
        [HttpGet("byStudentId")]
        public async Task<IActionResult> GetFeeStructuresByStudentId(string studentId)
        {
            if (!Guid.TryParse(studentId, out _))
            {
                return BadRequest("Invalid student ID format.");
            }

            var feeStructures = await _studentProfileService.GetFeeStructuresByStudentId(studentId);
            var feeStructureDtos = feeStructures.Select(fs => new FeeStructureDTO
            {
                InstallmentId = fs.InstallmentId,
                StudentId = fs.StudentId,
                CourseDetailId = fs.CourseDetailId,
                TotalInstallment = fs.TotalInstallment,

                FeeInstallments = fs.FeeInstallments.Select(fi => new FeeDTO
                {
                    FeeId = fi.FeeId, // Changed to fi.FeeId to match Fee entity
                    FeeStructureId = fi.FeeStructureId,
                    InstallmentNumber = fi.InstallmentNumber,
                    DueDate = fi.DueDate,
                    Amount = fi.Amount,
                    Status = fi.Status
                }).ToList()
            }).ToList();

            return Ok(feeStructureDtos);
        }
        [HttpGet("CourseDetails/byStudentProfileId")]
        public async Task<IActionResult> GetCourseDetailsByStudentId([FromQuery] string studentProfileId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(studentProfileId))
                    return BadRequest("studentProfileId is required.");

                var courseDetails = await _studentProfileService.GetCourseDetailsByStudentId(studentProfileId);
                if (courseDetails == null || !courseDetails.Any())
                    return NotFound("No course details found for this student.");

                return Ok(courseDetails);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message); // e.g., "studentProfileId must be a valid GUID."
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while fetching course details.");
            }
        }


        [HttpGet("GetFeesByStudentId/{studentId}")]
        public async Task<IActionResult> GetFeesByStudentId(Guid studentId)
        {
            try
            {
                var fees = await _studentProfileService.GetFeesByStudentId(studentId);
                

                return Ok(fees);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //added

        [HttpPost("AddSecondaryContact")]
        public async Task<IActionResult> AddSecondaryContact([FromBody] SecondaryContactDto dto)
        {
            try
            {
                var result = await _studentProfileService.AddSecondaryContactAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }


        [HttpGet("GetSecondaryContactById")]
        public async Task<IActionResult> GetSecondaryContactByStudentId([FromQuery] Guid studentId)
        {
            try
            {
                var result = await _studentProfileService.GetSecondaryContactByStudentIdAsync(studentId);
                if (result == null)
                    return NotFound("Secondary contact not found for the given student ID.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        [HttpPut("UpdateSecondaryContact")]
        public async Task<IActionResult> UpdateSecondaryContact([FromBody] SecondaryContactDto dto)
        {
            try
            {
                var result = await _studentProfileService.UpdateSecondaryContactAsync(dto);
                if (result == null)
                    return NotFound("Secondary contact not found for update.");

                return Ok(result);
            }
            catch (Exception ex)    
            {
                return BadRequest(new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        //[HttpGet("test-email")]
        //public async Task<IActionResult> TestEmail()
        //{
        //    try
        //    {
        //        await _emailService.SendEmailAsync(new EmailDto
        //        {
        //            To = "yourgmail@gmail.com",
        //            Subject = "Testing Email",
        //            Body = "<h2>Hello, this is a test email.</h2>"
        //        });

        //        return Ok("Email sent!");
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message + " | " + ex.InnerException?.Message);
        //    }
        //}



    }
}