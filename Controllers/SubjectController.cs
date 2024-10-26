using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBankData.Models;

namespace QuestionBank.Controllers
{
	[Route("[controller]/[action]")]
	[ApiController]
	public class SubjectController : ControllerBase
	{
		private readonly ISubjectService service;
		public SubjectController(ISubjectService service)
		{
			this.service = service;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetSubjectsByUser(bool showAll)
		{
			return Ok(await service.GetSubjectsByUser(showAll));
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> AddSubject(string name)
		{
			var res = await service.AddSubject(name);
			if (res is not null)
				return Ok(res);
			return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> LoadSubjects()
		{
			return Ok(await service.LoadSubjects());
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> DeleteSubject(Guid id)
		{
			if (await service.DeleteSubject(id))
				return Ok();
			return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> EditSubject(Guid id, string name)
		{
			var res = await service.EditSubject(id, name);
			if (res is not null)
				return Ok(res);
			return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
		}

		[HttpPost]
		[Authorize]
		public async Task<IActionResult> AssignSubject(string userId, Guid subjectId)
		{
			var res = await service.AssignSubject(userId, subjectId);
			if (res is not null)
				return Ok(res);
			return StatusCode(StatusCodes.Status400BadRequest, "Cannot assign same subject to user.");
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> LoadAssignedSubjects()
		{
			return Ok(await service.LoadAssignedSubjects());
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> UnassignSubject(Guid id)
		{
			if (await service.UnassignSubject(id))
				return Ok();
			return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
		}
	}
}
