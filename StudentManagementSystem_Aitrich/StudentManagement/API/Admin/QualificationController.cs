using AutoMapper;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.API.Admin.RequestObjects;
using Domain.Exceptions;
using StudentManagement.Controllers;
using Microsoft.AspNetCore.Authorization;

namespace StudentManagement.API.Admin
{
	
	[ApiController]

	
	[Authorize]
	public class QualificationController : BaseAPIController<QualificationController>
    {
		private readonly IQualificationService _qualificationService;
		private readonly IMapper _mapper;
		public QualificationController(IQualificationService qualificationService, IMapper mapper)
		{
			_qualificationService = qualificationService;
			_mapper = mapper;
		}

		[HttpPost("qualification")]

		public async Task<IActionResult> Addqualification([FromBody] QualificationMasterRequestDTO qualification)
		{
			try
			{
				var newQualification = _mapper.Map<QualificationMasterDTO>(qualification);
				await _qualificationService.AddQualifications(newQualification);
				return Ok(new { qualificationName = newQualification.QualificationName });

			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
		[HttpGet("qualification")]
		public async Task<IActionResult> GetAllQualifications()
		{
			try
			{
				var qualificcations = await _qualificationService.GetAllQualifications();
				if (qualificcations == null)
				{
					throw new ItemNotFoundException("No courses available");
				}
				return Ok(qualificcations);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
		[HttpDelete("qualification/{qualificationId:guid}")]
		public async Task<IActionResult> Delete(Guid qualificationId)
		{
			try
			{
				await _qualificationService.DeleteQualificationAsync(qualificationId);
				return NoContent();
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal Server Error: {ex.Message}");
			}
		}
		[HttpPut("qualification/{qualificationId:guid}")]
		public async Task<IActionResult> Update(Guid qualificationId, QualificationMasterRequestDTO dto)
		{
			try
			{
				var qualificationDto = _mapper.Map<QualificationMasterDTO>(dto);
				await _qualificationService.UpdateQualificationAsync(qualificationId, qualificationDto);
				return Ok(dto);
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Update failed: {ex.Message}");
			}
		}
		[HttpGet("qualificationbyname")]
		public async Task<IActionResult> GetQualificationByName([FromQuery] string name)
		{
			try
			{
				var qualification = await _qualificationService.GetQualificationByName(name);
				if (qualification == null)
				{
					throw new ItemNotFoundException("Qualification not found");
				}
				return Ok(qualification);
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
		}
        [HttpGet("qualification/{qualificationId:guid}")]
        public async Task<IActionResult> GetQualificationById(Guid qualificationId)
        {
            var qualification = await _qualificationService.GetQualificationById(qualificationId);
            if (qualification == null)
                return NotFound("Qualification not found");
            return Ok(qualification);
        }


    }
}