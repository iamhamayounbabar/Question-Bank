using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PaperTypeController : ControllerBase
    {
        private readonly IPaperTypeService service;
        public PaperTypeController(IPaperTypeService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPaperType(int id)
        {
            return Ok(await service.GetPaperType(id));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPaperType(string name)
        {
            var res = await service.AddPaperType(name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeletePaperType(int id)
        {
            if (await service.DeletePaperType(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadPaperTypes()
        {
            return Ok(await service.LoadPaperTypes());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditPaperType(int id, string name)
        {
            var res = await service.EditPaperType(id, name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
