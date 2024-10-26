using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerService answerService;
        public AnswerController(IAnswerService answerService)
        {
            this.answerService = answerService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddUpdateAnswers(Guid id, List<AddAnswersRequest> answersRequests)
        {
            var res = await answerService.AddUpdateAnswers(id, answersRequests);
			if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong.");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> MarAnswerApproved(Guid id, List<AddAnswersRequest> answersRequests)
        {
            var res = await answerService.MarAnswerApproved(id, answersRequests);
            if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not get the question");
        }

    }
}
