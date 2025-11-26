using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class ItemAlreadyExistException:Exception
    {
        public ItemAlreadyExistException() { }
        public ItemAlreadyExistException(string message) : base(message) { }
    }
}
