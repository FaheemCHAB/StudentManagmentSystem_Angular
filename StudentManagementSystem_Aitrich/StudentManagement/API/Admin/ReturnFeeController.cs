using AutoMapper;
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
    public class ReturnFeeController : BaseAPIController<ReturnFeeController>
    {
        private readonly IReturnFeeService _returnFeeService;
        private readonly IMapper _mapper;
        public ReturnFeeController(IReturnFeeService returnFeeService,IMapper mapper)
        {
            _returnFeeService = returnFeeService;
            _mapper = mapper;
        }

        [HttpPost("returnFee")]
        public async Task<IActionResult> AddReturnFee(ReturnFeeRequest returnFee)
        {
            var fee=_mapper.Map<ReturnFeeDTO>(returnFee);
            var addedFee=await _returnFeeService.AddReturnFee(fee);
            return Ok(addedFee);
        }
    }
}
