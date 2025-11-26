using AutoMapper;
using Domain.Exceptions;
using Domain.Models;
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
    public class CollegeController :BaseAPIController<CollegeController>
    {
        private readonly ICollegeService collegeService;
        private readonly IMapper mapper;

        public CollegeController(ICollegeService collegeService, IMapper mapper)
        {
            this.collegeService = collegeService;
            this.mapper = mapper;
        }

        [HttpGet("Colleges")]
        public async Task<IActionResult> GetAllColleges()
        {
            try
            {
                var colleges = await collegeService.GetAllColleges();

                return Ok(colleges);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("college/{collegeId}")]

        public async Task<IActionResult> GetCollegeById(Guid collegeId)
        {
            try
            {
                var colllege = await collegeService.GetCollegeById(collegeId);

                return Ok(colllege);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("colleges")]
        public async Task<IActionResult> AddCollege([FromBody] CollegeRequest collegeRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                });
            }

            try
            {
                var collegeDto = mapper.Map<CollegeDto>(collegeRequest);
                var result = await collegeService.AddCollege(collegeDto);

                return Ok(new
                {
                    success = true,
                    data = result,
                    message = "College added successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    error = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }





        [HttpPut("College/{id}")]
        public async Task<IActionResult> UpdateCollege(Guid id, [FromBody] CollegeRequest collegeRequest)
        {
            var collegeDto = mapper.Map<CollegeDto>(collegeRequest);

            await collegeService.UpdateCollege(id, collegeDto);
            return Ok(new { message = "College updated successfully" });

        }



        [HttpDelete("College/{id}")]
        public async Task<IActionResult> DeleteCollege(Guid id)
        {
            try
            {
                await collegeService.DeleteCollegeById(id);
                return Ok(new { message = "College deleted successfully" }); ;
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpGet("collegeName")]
        public async Task<IActionResult> GetCollegeByName([FromQuery] string name)
        {
            try
            {
                var college = await collegeService.GetCollegeByName(name);
                if (college == null)
                {
                    throw new ItemNotFoundException("College not found");
                }
                return Ok(college);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
