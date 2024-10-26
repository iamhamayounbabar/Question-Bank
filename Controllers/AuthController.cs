using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestionBank.Interfaces;
using QuestionBank.Services;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService service;
        public AuthController(IAuthService service)
        {
            this.service = service;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RegisterUser(Users model)
        {
            var response = await service.RegisterUser(model);
            if (response.Status == StatusCodes.Status200OK)
                return Ok(response.Message);
            return StatusCode(response.Status, response.Message);
        }

        [HttpPost]
        public async Task<IActionResult> LoginUser(Login model)
        {
            var response = await service.LoginUser(model);
            if (response.Status == StatusCodes.Status200OK)
                return Ok(response.Message);
            return BadRequest(response.Message);
        }

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> IsAuthenticated()
		{
			if(await service.IsAuthenticated())
            {
                return Ok(true);
            }
            return Unauthorized(false);
		}

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> GetAllNonAdminUsers()
		{
			return Ok(await service.GetAllNonAdminUsers());
		}
	}
}
