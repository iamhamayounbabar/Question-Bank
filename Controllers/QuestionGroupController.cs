using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class QuestionGroupController : ControllerBase
    {
        private readonly IQuestionGroupService service;
        public QuestionGroupController(IQuestionGroupService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionGroups()
        {
            return Ok(await service.GetQuestionGroups());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddQuestionGroup(AddQuestionGroupRequest questionGroupRequest)
        {
            return Ok(await service.AddQuestionGroup(questionGroupRequest));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionGroupByVersionId(Guid id)
        {
            var res = await service.GetQuestionGroupByVersionId(id);
            if (res is not null)
            {
                return Ok(res);
            }
            return NotFound("Could not get the question group");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeleteQuestionGroup(Guid id)
        {
            if (await service.DeleteQuestionGroup(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateQuestionGroup(Guid id, AddQuestionGroupRequest questionGroupRequest)
        {
            var res = await service.UpdateQuestionGroup(id, questionGroupRequest);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
