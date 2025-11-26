using AutoMapper;
using Domain.Exceptions;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Controllers;

namespace StudentManagement.API.Admin
{
    [ApiController]
    [Authorize]
    public class CourseController : BaseAPIController<CourseController>
    {
        private readonly ICourseService _courseService;
        private readonly IMapper _mapper;
        public CourseController(ICourseService courseService,IMapper mapper)
        {
            _courseService = courseService;
            _mapper = mapper;
        }

        [HttpPost("courses")]
        public async Task<IActionResult> AddNewCourse(CreateCourseDto course)
        {
            try
            {
                var newCourse = _mapper.Map<CourseDTO>(course);
                await _courseService.AddCourse(newCourse);
                return Ok(new { courseName = newCourse.CourseName });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses()
        {
            try
            {
                var courses = await _courseService.GetAllCourses();
                if (courses == null)
                {
                    throw new ItemNotFoundException("No courses available");
                }
                return Ok(courses);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("courses/{courseId:guid}")]
        public async Task<IActionResult> GetCourseById(Guid courseId)
        {
            try
            {
                var course = await _courseService.GetCourseById(courseId);
                if (course == null)
                {
                    throw new ItemNotFoundException("Course not found");
                }
                return Ok(course);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("course")]
        public async Task<IActionResult> GetCourseByName([FromQuery] string name)
        {
            try
            {
                var course = await _courseService.GetCourseByName(name);
                if (course == null)
                {
                    throw new ItemNotFoundException("Course not found");
                }
                return Ok(course);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("courses/{courseId:guid}")]
        public async Task<IActionResult> Update(Guid courseId, CreateCourseDto dto)
        {
            try
            {
                var courseDto = _mapper.Map<CourseDTO>(dto);
                await _courseService.UpdateCourseAsync(courseId, courseDto);
                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Update failed: {ex.Message}");
            }
        }

        [HttpDelete("courses/{courseId:guid}")]
        public async Task<IActionResult> Delete(Guid courseId)
        {
            try
            {
                await _courseService.DeleteCourseAsync(courseId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}

