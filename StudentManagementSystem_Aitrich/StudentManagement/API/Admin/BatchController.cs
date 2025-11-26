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
    public class BatchController : BaseAPIController<BatchController>
    {
        private readonly IBatchService _batchService;
        private readonly IMapper _mapper;
        public BatchController(IBatchService batchService, IMapper mapper)
        {
            _batchService = batchService;
            _mapper = mapper;
        }

        [HttpGet("batches")]
        public async Task<IActionResult> GetAllBatches()
        {
            try
            {
                var batches = await _batchService.GetAllBatchesAsync();
                if (batches == null)
                {
                    throw new ItemNotFoundException("No courses available");
                }
                return Ok(batches);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("batch/{id:guid}")]
        public async Task<IActionResult> GetBatchById(Guid id)
        {
            try
            {
                var batch = await _batchService.GetBatchByIdAsync(id);
                if (batch == null)
                {
                    throw new ItemNotFoundException("Batch not found");
                }
                return Ok(batch);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("batchname")]
        public async Task<IActionResult> SearchBatchByName(string name)
        {
            try
            {
                var batches = await _batchService.SearchByNameAsync(name);
                if (batches == null)
                {
                    throw new ItemNotFoundException("No match found");
                }
                return Ok(batches);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost("batches")]
        public async Task<IActionResult> AddBatches(CreateBatchDTO batch)
        {
            try
            {
                var newBatch = _mapper.Map<BatchDTO>(batch);
                await _batchService.AddBatchAsync(newBatch);
                return Ok(newBatch);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("batches/{id:guid}")]
        public async Task<IActionResult> UpdateBatch(Guid id, [FromBody] CreateBatchDTO dto)
        {
            var updatebatch = _mapper.Map<BatchDTO>(dto);
          var result =   await _batchService.UpdateBatchAsync(id, updatebatch);
            return Ok(result);
        }
        [HttpDelete("batches/{id:guid}")]
        public async Task<IActionResult> DeleteBatch(Guid id)
        {
            try
            {
                await _batchService.DeleteBatchAsync(id);
                return Ok();
            }
            catch (ItemNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
            }
         
        }
    }
    

