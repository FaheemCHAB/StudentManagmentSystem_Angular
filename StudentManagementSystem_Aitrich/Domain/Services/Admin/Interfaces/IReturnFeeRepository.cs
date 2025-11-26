
using Domain.Services.Admin.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Services.Admin.Interfaces
{
    public interface IReturnFeeRepository
    {
        Task<Models.ReturnFee> AddReturnFee(Models.ReturnFee returnFee);
    }
}
