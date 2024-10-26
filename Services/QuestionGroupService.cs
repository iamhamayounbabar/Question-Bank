using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models.Api_Models;
using QuestionBankData.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace QuestionBank.Services
{
    public class QuestionGroupService : IQuestionGroupService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        public QuestionGroupService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<List<QuestionGroupVersions>> GetQuestionGroups()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            var questionGroups =  await context.QuestionGroupVersions
                .Include(i => i.Organization)
                .GroupBy(g => g.QuestionGroupId)
                .Select(s => s.OrderByDescending(o => o.DateCreated).First())
                .ToListAsync();

            questionGroups.ForEach(q =>
            {
                var user = context.Users.Find(q.CreatedBy);
                q.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
            });

            return questionGroups;
        }

        public async Task<bool> AddQuestionGroup(AddQuestionGroupRequest questionGroupRequest)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            QuestionGroup questionGroup = new();
            questionGroup.CreatedBy = userId;
            await context.QuestionGroup.AddAsync(questionGroup);
            if (await context.SaveChangesAsync() > 0)
            {
                QuestionGroupVersions questionGroupVersion = new();
                questionGroupVersion.VersionNumber = 1;
                questionGroupVersion.QuestionGroupId = questionGroup.Id;
                questionGroupVersion.OrganizationId = questionGroupRequest.Organization;
                questionGroupVersion.Title = questionGroupRequest.Title;
                questionGroupVersion.Body = questionGroupRequest.Body;
                questionGroupVersion.CreatedBy = userId;
                questionGroupVersion.VersionNumber = 1;

                await context.QuestionGroupVersions.AddAsync(questionGroupVersion);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> DeleteQuestionGroup(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var questionGroup = await context.QuestionGroup.FindAsync(id);
            if (questionGroup != null)
            {
                context.QuestionGroup.Remove(questionGroup);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<QuestionGroupVersions> GetQuestionGroupByVersionId(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var questionGroup = await context.QuestionGroupVersions
                .Include(i => i.Organization)
                .Include(i => i.QuestionGroup)
                .FirstOrDefaultAsync(q => q.Id == id);
            return questionGroup;
        }

        public async Task<Guid?> UpdateQuestionGroup(Guid id, AddQuestionGroupRequest questionGroupRequest)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questionGroupVersionExisting = await context.QuestionGroupVersions.FindAsync(id);
            if (questionGroupVersionExisting is not null)
            {
                QuestionGroupVersions questionGroupVersion = new();
                questionGroupVersion.VersionNumber = questionGroupVersionExisting.VersionNumber + 1;
                questionGroupVersion.QuestionGroupId = questionGroupVersionExisting.QuestionGroupId;
                questionGroupVersion.OrganizationId = questionGroupRequest.Organization;
                questionGroupVersion.Title = questionGroupRequest.Title;
                questionGroupVersion.Body = questionGroupRequest.Body;
                questionGroupVersion.CreatedBy = userId;

                await context.QuestionGroupVersions.AddAsync(questionGroupVersion);
                if (await context.SaveChangesAsync() > 0)
                {
                    return questionGroupVersion.Id;
                }
            }
            return null;
        }
    }
}
