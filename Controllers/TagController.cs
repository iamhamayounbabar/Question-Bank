using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService service;
        public TagController(ITagService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTags()
        {
            return Ok(await service.GetTags());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddTag(string name)
        {
            var res = await service.AddTag(name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadTags()
        {
            return Ok(await service.LoadTags());
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            if (await service.DeleteTag(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditTag(Guid id, string name)
        {
            var res = await service.EditTag(id, name);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
