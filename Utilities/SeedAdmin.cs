using Microsoft.AspNetCore.Identity;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;

namespace Serviceheroe.Utility
{
	public static class SeedAdmin
	{
		public static void SeedData(UserManager<AspNetUser> userManager, RoleManager<IdentityRole> roleManager, QuestionBankContext context)
		{
			SeedAdminUser(userManager, roleManager);
			SeedQuestionTypes(context);
			SeedReviewStatuses(context);
		}
		private static void SeedAdminUser(UserManager<AspNetUser> userManager, RoleManager<IdentityRole> roleManager)
		{
			if (userManager.FindByEmailAsync("admin@questionbank.com").Result == null)
			{
				AspNetUser user = new()
				{
					Name = "Admin",
					Email = "admin@questionbank.com",
					UserName = "admin@questionbank.com",
					Role = Roles.Admin,
				};

				IdentityResult result = userManager.CreateAsync(user, "Admin$@QuestionBank1").Result;

				if (result.Succeeded)
				{
					if (!roleManager.RoleExistsAsync(Roles.Admin).Result)
						roleManager.CreateAsync(new IdentityRole(Roles.Admin)).Wait();

					if (roleManager.RoleExistsAsync(Roles.Admin).Result)
						userManager.AddToRoleAsync(user, Roles.Admin).Wait();
				}
			}
		}

		private static void SeedQuestionTypes(QuestionBankContext context)
		{
			if (!context.QuestionType.Any())
			{
				var types = Enum.GetNames<QuestionTypes>();
				List<QuestionType> questionTypes = new();
				foreach (var type in types)
				{
					questionTypes.Add(new QuestionType
					{
						Name = type
					});
				}

				context.QuestionType.AddRange(questionTypes);
				context.SaveChanges();
			}
		}

		private static void SeedReviewStatuses(QuestionBankContext context)
		{
			if (!context.ReviewStatus.Any())
			{
				var statuses = Enum.GetNames<QuestionStatus>();
				List<ReviewStatus> statusesToAdd = new();
				foreach (var status in statuses)
				{
					statusesToAdd.Add(new ReviewStatus
					{
						Name = status
					});
				}

				context.ReviewStatus.AddRange(statusesToAdd);
				context.SaveChanges();
			}
		}
	}
}
