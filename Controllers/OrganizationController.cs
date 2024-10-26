using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;

namespace QuestionBank.Controllers
{
	[Route("[controller]/[action]")]
	[ApiController]
	public class OrganizationController : ControllerBase
	{
		private readonly IOrganizationService service;
		public OrganizationController(IOrganizationService service)
		{
			this.service = service;
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetOrganizations()
		{
			return Ok(await service.GetOrganizations());
		}

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddOrganization(string name, string logo, string website, string copyright)
        {
            var res = await service.AddOrganization(name, logo, website, copyright);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> DeleteOrganization(Guid id)
        {
            if (await service.DeleteOrganization(id))
                return Ok();
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> EditOrganization(Guid id, string name, string logo, string website, string copyright)
        {
            var res = await service.EditOrganization(id, name, logo, website, copyright);
            if (res is not null)
                return Ok(res);
            return StatusCode(StatusCodes.Status500InternalServerError, "Something went wrong");
        }
    }
}
