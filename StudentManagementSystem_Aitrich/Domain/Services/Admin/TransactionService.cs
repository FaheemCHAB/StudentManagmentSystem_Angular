using Domain.Enums;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }
        public Task<Transaction> AddTransaction(Guid studentId, double amount, TransactionMode status, string remark)
        {
            var transaction = new Transaction
            {
                StudentId = studentId,
                TransactionAmount = amount,
                Status = status,
                Remark = remark,
                TransactionDate = DateTime.Now
            };

            var newTransaction=_transactionRepository.AddTransaction(transaction);
            return newTransaction;
        }

        public async Task<List<TransactionDTO>> GetTransactions()
        {
            var newTransaction=await _transactionRepository.GetTransactions();
            var transactionDTOs = newTransaction.Select(t => new TransactionDTO
            {
                

                StudentName = t.StudentId == null
            ? $"{t.TrialStudent?.FirstName} {t.TrialStudent?.LastName}".Trim()
            : $"{t.StudentProfile?.FirstName} {t.StudentProfile?.LastName}".Trim(),

                TransactionAmount = t.TransactionAmount,
                Status = t.Status,
                Remark = t.Remark,
                TransactionDate = t.TransactionDate
            }).ToList();
            return transactionDTOs;
        }
    }
}
