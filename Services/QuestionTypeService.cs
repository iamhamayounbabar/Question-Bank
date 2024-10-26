using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
    public class QuestionTypeService : IQuestionTypeService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        public QuestionTypeService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<List<QuestionType>> GetQuestionType(int id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var questionType = await context.QuestionType.FindAsync(id);
            if (questionType is not null)
                return await context.QuestionType.Where(w => w.Name == questionType.Name).ToListAsync();
            return new List<QuestionType>();
        }

        public async Task<QuestionType> AddQuestionType(string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            QuestionType questionType = new();
            questionType.Name = name;
            await context.QuestionType.AddAsync(questionType);
            if (await context.SaveChangesAsync() > 0)
            {
                return questionType;
            }
            return null;
        }
        public async Task<List<QuestionType>> LoadQuestionTypes()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.QuestionType.ToListAsync();
        }

        public async Task<bool> DeleteQuestionType(int id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var questionType = await context.QuestionType.FindAsync(id);
            if (questionType is not null)
            {
                context.QuestionType.Remove(questionType);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<QuestionType> EditQuestionType(int id, string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questionType = await context.QuestionType.FindAsync(id);
            if (questionType is not null)
            {
                questionType.Name = name;
                context.QuestionType.Update(questionType);
                if (await context.SaveChangesAsync() > 0)
                {
                    return questionType;
                }
            }
            return null;
        }
    }
}
