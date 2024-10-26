using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
	public class SubjectService : ISubjectService
	{
		private readonly IServiceScopeFactory factory;
		private readonly IHttpContextAccessor userContext;
		public SubjectService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

		{
			this.factory = factory;
			this.userContext = userContext;
		}

		public async Task<List<SubjectResponse>> GetSubjectsByUser(bool showAll)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (showAll)
			{
				return await context.Subject.Select(sel => new SubjectResponse { Id = sel.Id, Name = sel.Name }).ToListAsync();

            }
            else
			{
				return await context.SubjectUser.Where(w => w.UserId == userId).Include(i => i.Subject).Select(sel => new SubjectResponse { Id = sel.SubjectId, Name = sel.Subject.Name }).ToListAsync();

            }
		}

		public async Task<Subject> AddSubject(string name)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

			Subject subject = new();
            subject.Name = name;
			subject.CreatedBy = userId;
			await context.Subject.AddAsync(subject);
            if (await context.SaveChangesAsync() > 0)
			{
				return subject;
            }
			return null;
		}

		public async Task<List<Subject>> LoadSubjects()
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

			return await context.Subject.ToListAsync();
		}

		public async Task<bool> DeleteSubject(Guid id)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var subject = await context.Subject.FindAsync(id);
			if (subject is not null)
			{
				context.Subject.Remove(subject);
				if (await context.SaveChangesAsync() > 0)
				{
					return true;
				}
			}
			return false;
		}

		public async Task<Subject> EditSubject(Guid id, string name)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

			var subject = await context.Subject.FindAsync(id);
			if (subject is not null)
			{
				subject.Name = name;
				subject.ModifiedBy = userId;
				subject.DateModified = DateTime.UtcNow;
				context.Subject.Update(subject);
				if (await context.SaveChangesAsync() > 0)
				{
					return subject;
				}
			}
			return null;
		}

		public async Task<SubjectUser> AssignSubject(string userId, Guid subjectId)
		{
			using var scope = factory.CreateScope();
			var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

			var userSubject = await context.SubjectUser.FirstOrDefaultAsync(f => f.SubjectId == subjectId && f.UserId == userId);
			if(userSubject is null)
			{
				SubjectUser subjectUser = new();
				subjectUser.SubjectId = subjectId;
				subjectUser.UserId = userId;
				await context.SubjectUser.AddAsync(subjectUser);
				if(await context.SaveChangesAsync() > 0)
				{
					subjectUser.Subject = await context.Subject.FindAsync(subjectId);
					subjectUser.User = await userManager.FindByIdAsync(userId);
					return subjectUser;
				}
			}
			return null;
		}

		public async Task<List<SubjectUser>> LoadAssignedSubjects()
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

			var subjects = await context.SubjectUser.Include(i => i.Subject).ToListAsync();
			subjects.ForEach(s =>
			{
				var user = context.Users.Find(s.UserId);
				s.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
			});
			return subjects;
		}

		public async Task<bool> UnassignSubject(Guid id)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var subject = await context.SubjectUser.FindAsync(id);
			if (subject is not null)
			{
				context.SubjectUser.Remove(subject);
				if (await context.SaveChangesAsync() > 0)
				{
					return true;
				}
			}
			return false;
		}
	}
}
