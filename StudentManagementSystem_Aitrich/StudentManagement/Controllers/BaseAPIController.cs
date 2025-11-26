using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.Controllers
{
    [Route("api/v1")]

    public  class BaseAPIController<T> : ControllerBase
    {
    }
}
