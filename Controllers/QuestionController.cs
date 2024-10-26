using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBank.Services;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionService service;
        public QuestionController(IQuestionService service)
        {
            this.service = service;
        }

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> AddQuestion(AddQuestionRequest questionRequest)
		{
			return Ok(await service.AddQuestion(questionRequest));
		}

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestions()
        {
            return Ok(await service.GetQuestions());
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionsForApproval()
        {
            return Ok(await service.GetQuestionsForApproval());
        }

        [HttpGet]
		[Authorize]
		public async Task<IActionResult> GetYearGroups()
		{
			return Ok(await service.GetYearGroups());
		}

		[HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionGroups()
        {
            return Ok(await service.GetQuestionGroups());
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetQuestionTypes()
        {
            return Ok(await service.GetQuestionTypes());
        }
        
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetComplexities()
        {
            return Ok(await service.GetComplexities());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeleteQuestion(Guid id)
        {
            if (await service.DeleteQuestion(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
		public async Task<IActionResult> GetQuestionByVersionId(Guid id)
        {
            var res = await service.GetQuestionByVersionId(id);
			if (res is not null)
            {
                return Ok(res);
            }
            return NotFound("Could not get the question");
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
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not get the question");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UpdateQuestion(Guid id, AddQuestionRequest questionRequest)
        {
            var res = await service.UpdateQuestion(id, questionRequest);
            if (res != null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> MarkQuestionApproved(Guid id)
        {
            var res = await service.MarkQuestionApproved(id);
            if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not get the question");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetReviewComment(Guid questionId)
        {
            var res = await service.GetReviewComment(questionId);
            if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not get review");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReviewComment(string reviewComment, Guid relatedTo)
        {
            var res = await service.AddReviewComment(reviewComment, relatedTo);
            if (res is not null)
            {
                return Ok(res);
            }
            return StatusCode(StatusCodes.Status500InternalServerError, "Could not add review");
        }

    }
}
