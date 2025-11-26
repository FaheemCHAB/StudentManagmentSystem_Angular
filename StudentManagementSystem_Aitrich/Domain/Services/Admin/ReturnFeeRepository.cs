using Domain.Models;
using Domain.Services.Admin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
    public class ReturnFeeRepository : IReturnFeeRepository
    {
        private readonly StudentManagementDbContext _context;
        public ReturnFeeRepository(StudentManagementDbContext context)
        {
            _context = context;
        }

        public async Task<Models.ReturnFee> AddReturnFee(Models.ReturnFee returnFee)
        {
            var result = await _context.ReturnFees.AddAsync(returnFee);
            await _context.SaveChangesAsync();
            return result.Entity;
        }
    }
}
