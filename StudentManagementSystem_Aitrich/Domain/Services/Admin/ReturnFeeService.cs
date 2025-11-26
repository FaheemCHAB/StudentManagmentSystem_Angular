using AutoMapper;
using Domain.Enums;
using Domain.Services.Admin.DTOs;
using Domain.Services.Admin.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Domain.Services.Admin
{
    public class ReturnFeeService : IReturnFeeService
    {
        private readonly IReturnFeeRepository _repository;
        private readonly IMapper _mapper;
        private readonly ITransactionService _transactionService;
        public ReturnFeeService(IReturnFeeRepository repository,IMapper mapper, ITransactionService transactionService)
        {
            _repository = repository;
            _mapper = mapper;
            _transactionService = transactionService;
        }
        public async Task<ReturnFeeDTO> AddReturnFee(ReturnFeeDTO returnFeeDTO)
        {
            var returnFeeEntity=_mapper.Map<Models.ReturnFee>(returnFeeDTO);
            var returnFee=await _repository.AddReturnFee(returnFeeEntity);
            var feeDto = _mapper.Map<ReturnFeeDTO>(returnFee);
            await _transactionService.AddTransaction(
                                             returnFee.StudentId,
                                             returnFee.ReturnAmount,
                                             TransactionMode.Debit,
                                             returnFee.Remarks ?? "Refund"
);
            return feeDto;

        }
    }
}
