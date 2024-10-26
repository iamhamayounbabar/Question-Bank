using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class PaperController : ControllerBase
    {
        private readonly IPaperService service;
        public PaperController(IPaperService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPapers()
        {
            return Ok(await service.GetPapers());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddPaper(AddPaperRequest paperRequest)
        {
            return Ok(await service.AddPaper(paperRequest));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPaperByVersionId(Guid id)
        {
            var res = await service.GetPaperByVersionId(id);
            if (res is not null)
            {
                return Ok(res);
            }
            return NotFound("Could not get the paper");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeletePaper(Guid id)
        {
            if (await service.DeletePaper(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdatePaper(Guid id, AddPaperRequest paperRequest)
        {
            var res = await service.UpdatePaper(id, paperRequest);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> SubmitForApproval(Guid id)
        {
            var res = await service.SubmitForApproval(id);
            if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not get the paper");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPapersForApproval()
        {
            return Ok(await service.GetPapersForApproval());
        }
    }
}
