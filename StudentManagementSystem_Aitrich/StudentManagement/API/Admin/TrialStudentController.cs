using AutoMapper;

using Domain.Exceptions;

using Domain.Services.Admin;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.API.Admin.RequestObjects;
using StudentManagement.Controllers;

namespace StudentManagement.API.Admin
{

    [ApiController]
    [Authorize]
    public class TrialStudentController : BaseAPIController<TrialStudentController>
    {
        private readonly ITrialStudentService _studentService;
        private readonly IMapper mapper;

        public TrialStudentController(ITrialStudentService studentService, IMapper mapper)
        {
            _studentService = studentService;
            this.mapper = mapper;
        }


        [HttpGet("trialStudent")]
        public async Task<IActionResult> GetCourseByName([FromQuery] string name)
        {
            try
            {
                var trialStudents = await _studentService.GetTrialStudentByName(name);
                if (trialStudents == null)
                {
                    throw new ItemNotFoundException("Trial Student not found");
                }
                return Ok(trialStudents);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("TrialStudent")]

        public async Task<IActionResult> AddTrialStudent(TrialStudentRequest trialStudentRequest)
        {
            try
            {
                var trialStudent = mapper.Map<TrialStudentDto>(trialStudentRequest);
                var result = await _studentService.AddTrialStudent(trialStudent);
                return Ok(result);

            }
            catch (ItemAlreadyExistException ex)
            {
                return Conflict(new { message = ex.Message }); // 409 Conflict is semantically correct
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }


        [HttpPut("TrialStudent/{id}")]
        public async Task<IActionResult> Update(Guid id, TrialStudentRequest trialRequest)
        {
            var trialStudentDto = mapper.Map<TrialStudentDto>(trialRequest);
            await _studentService.UpdateTrialStudent(id, trialStudentDto);
            return Ok(trialStudentDto);
        }

        [HttpDelete("TrialStudent/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _studentService.DeleteTrialStudentById(id);
            return Ok();
        }




        [HttpGet("TrialStudents")]
        public async Task<IActionResult> GetAllTrialSrudents()
        {
            try
            {
                var students = await _studentService.GetAllTrialStudents();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("TrialStudent/{trialId}")]
        public async Task<IActionResult> GetTrialstudentById(Guid trialId)
        {
            try
            {
                var studentById = await _studentService.GetTrialStudentById(trialId);
                return Ok(studentById);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpGet("enrolled")]

        public async Task<IActionResult> GetEnrolledStudents()
        {
            var students = await _studentService.GetEnrolledTrialStudents();
            var enrolledStudents = mapper.Map<List<TrialStudentDto>>(students);
            return Ok(enrolledStudents);
        }


        [HttpGet("TrialStudent/fee/{trialStudentId}")]
        public async Task<IActionResult> GetRegistrationFeeStatus(Guid trialStudentId)
        {
            try
            {
                var fee = await _studentService.GetRegistrationFeeByTrialStudentId(trialStudentId);

                if (fee == null)
                    return NotFound(new { message = "No registration fee record found." });

                var feeDto = new RegistrationFeeDto
                {
                    RegistrationFeeId = fee.RegistrationFeeId,
                    TrialStudentId = fee.TrialStudentId,
                    Fee = fee.Fee ?? 0,
                    FeeStatus = fee.FeeStatus ?? Domain.Enums.FeeStatus.Pending,
                    FeeReceivedDate = fee.FeeReceivedDate ?? DateTime.Now
                };

                return Ok(feeDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("RegistrationFee/{trialStudentId}")]
        public async Task<IActionResult> GetRegistrationFeeByTrialId(Guid trialStudentId) 
        {
            var regFee =await _studentService.GetRegistrationFeeByTrialId(trialStudentId);
            if (regFee == null)
                return NotFound(new { message = "No registration fee record found." });

            return Ok(new { FeeStatus = regFee.FeeStatus });
        }

        // POST: api/v1/TrialStudent/payFee
        [HttpPost("TrialStudent/payFee")]
        public async Task<IActionResult> PayRegistrationFee([FromBody] RegistrationFeeRequest request)
        {
            try
            {
                var fee = await _studentService.PayRegistrationFee(request.TrialStudentId, request.Fee);

                var feeDto = new RegistrationFeeDto
                {
                    RegistrationFeeId = fee.RegistrationFeeId,
                    TrialStudentId = fee.TrialStudentId,
                    Fee = fee.Fee ?? 0,
                    FeeStatus = fee.FeeStatus ?? Domain.Enums.FeeStatus.Pending,
                    FeeReceivedDate = fee.FeeReceivedDate ?? DateTime.Now
                };

                return Ok(new { message = "Registration fee paid successfully.", fee = feeDto });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }        
}
    
