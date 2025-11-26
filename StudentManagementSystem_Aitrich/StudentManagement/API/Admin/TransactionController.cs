using Domain.Services.Admin.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Controllers;

namespace StudentManagement.API.Admin
{
    
    [ApiController]
    [Authorize]
    public class TransactionController : BaseAPIController<TransactionController>
    {
        private readonly ITransactionService _transactionService;
        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transaction =await _transactionService.GetTransactions();
            return Ok(new { transaction });
        }

    }
}
