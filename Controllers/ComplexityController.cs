using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class ComplexityController : ControllerBase
    {
        private readonly IComplexityService service;
        public ComplexityController(IComplexityService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetComplexity(int id)
        {
            return Ok(await service.GetComplexity(id));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddComplexity(string name)
        {
            var res = await service.AddComplexity(name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeleteComplexity(int id)
        {
            if (await service.DeleteComplexity(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadComplexity()
        {
            return Ok(await service.LoadComplexity());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditComplexity(int id, string name)
        {
            var res = await service.EditComplexity(id, name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
