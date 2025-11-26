using Domain.Enums;
using Domain.Models;
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Domain.Services.Admin.Interfaces
{
    public interface ITransactionService
    {
        Task<Transaction> AddTransaction(Guid studentId, double amount, TransactionMode status, string remark);
        Task<List<TransactionDTO>> GetTransactions();
    }
}
