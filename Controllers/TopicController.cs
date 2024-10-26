using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
	[Route("[controller]/[action]")]
	[ApiController]
	public class TopicController : ControllerBase
	{
		private readonly ITopicService service;
		public TopicController(ITopicService service)
		{
			this.service = service;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetTopics(Guid id)
		{
			return Ok(await service.GetTopics(id));
		}

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddTopic(string name, Guid? parentTopicId, Guid subjectId)
        {
            var res = await service.AddTopic(name, parentTopicId, subjectId);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> LoadTopics()
        {
            return Ok(await service.LoadTopics());
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> DeleteTopic(Guid id)
        {
            if (await service.DeleteTopic(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
