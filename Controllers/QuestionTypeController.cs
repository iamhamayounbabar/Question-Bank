using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class QuestionTypeController : ControllerBase
    {
        private readonly IQuestionTypeService service;
        public QuestionTypeController(IQuestionTypeService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionType(int id)
        {
            return Ok(await service.GetQuestionType(id));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddQuestionType(string name)
        {
            var res = await service.AddQuestionType(name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeleteQuestionType(int id)
        {
            if (await service.DeleteQuestionType(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadQuestionTypes()
        {
            return Ok(await service.LoadQuestionTypes());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditQuestionType(int id, string name)
        {
            var res = await service.EditQuestionType(id, name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
