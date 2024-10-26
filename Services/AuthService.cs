using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QuestionBank.Services
{
    public class AuthService : IAuthService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IConfiguration Configuration;
        private readonly IHttpContextAccessor userContext;

        public AuthService(IServiceScopeFactory factory, IConfiguration Configuration, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.Configuration = Configuration;
            this.userContext = userContext;
        }

		public async Task<List<AspNetUser>> GetAllNonAdminUsers()
		{
			using var scope = factory.CreateScope();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();

            var testCreator = await userManager.GetUsersInRoleAsync(Roles.Testcreator);
            var approver = await userManager.GetUsersInRoleAsync(Roles.Approver);
            var contentCreator = await userManager.GetUsersInRoleAsync(Roles.ContentCreator);

            var users = testCreator.Concat(approver)
                            .Concat(contentCreator)
                            .Distinct()
                            .Select(sel => sel = new AspNetUser { Id = sel.Id, Email = sel.Email, UserName = sel.UserName, Name = sel.Name })
                            .ToList();
            return users;
		}

		public async Task<bool> IsAuthenticated()
		{
			using var scope = factory.CreateScope();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();

            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
				var userExists = await userManager.FindByIdAsync(userId);
				if (userExists != null && DateTime.UtcNow - userExists.LastAccessTime <= TimeSpan.FromMinutes(60))
				{
					userExists.LastAccessTime = DateTime.UtcNow;
					await userManager.UpdateAsync(userExists);
					return true;
				}
			}
			return false;
		}

		public async Task<ReturnResponse> LoginUser(Login model)
        {
            using var scope = factory.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null || (user != null && !await userManager.CheckPasswordAsync(user, model.Password)))
            {
                return new ReturnResponse { Status = StatusCodes.Status400BadRequest, Message = "Incorrect Email or Password" };
            }

            var jwt = GenerateJwtToken(user);

            user.LastAccessTime = DateTime.UtcNow;
            await userManager.UpdateAsync(user);

            return new ReturnResponse
            {
                Status = StatusCodes.Status200OK,
                Message = jwt
            };
        }

        public async Task<ReturnResponse> RegisterUser(Users model)
        {
            using var scope = factory.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

			if (await userManager.FindByEmailAsync(model.Email) is not null)
            {
                return new ReturnResponse { Status = StatusCodes.Status400BadRequest, Message = "Email already exists." };
            }

            AspNetUser user = new()
            {
                Name = model.Name,
                UserName = model.Email,
                Email = model.Email,
                PasswordHash = model.Password,
                Role = model.Role,
                LastAccessTime = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(user, user.PasswordHash);

            if (result.Succeeded)
            {
				if (!await roleManager.RoleExistsAsync(user.Role))
					await roleManager.CreateAsync(new IdentityRole(user.Role));

				if (await roleManager.RoleExistsAsync(user.Role))
					await userManager.AddToRoleAsync(user, user.Role);

				return new ReturnResponse
                {
                    Status = StatusCodes.Status200OK,
                    Message = "User has been created successfully."
                };
            }
            return new ReturnResponse { Status = StatusCodes.Status500InternalServerError, Message = "Something Went Wrong." };
        }

        private object GenerateJwtToken(AspNetUser user)
        {
            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                expires: DateTime.Now.AddDays(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                role = user.Role,
                name = user.Name
            };
        }
    }
}
