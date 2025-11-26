using Domain.Enums;
using Domain.Models;
using Domain.Services.Admin.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly StudentManagementDbContext _studentManagementDbContext;
        public TransactionRepository(StudentManagementDbContext studentManagementDbContext)
        {
            _studentManagementDbContext = studentManagementDbContext;
        }
        public async Task<Transaction> AddTransaction(Transaction transaction)
        {
            var transactions=await _studentManagementDbContext.Transactions.AddAsync(transaction);
            await _studentManagementDbContext.SaveChangesAsync();
            return transaction;
        }

        public async Task<List<Transaction>> GetTransactions()
        {
            return await _studentManagementDbContext.Transactions
                                 .Include(s=>s.StudentProfile)
                                 .OrderByDescending(t => t.TransactionDate)
                                 .ToListAsync();
        }
    }
}
