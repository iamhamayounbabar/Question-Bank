using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
    public class ComplexityService : IComplexityService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        public ComplexityService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<List<Complexity>> GetComplexity(int id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var complexity = await context.Complexity.FindAsync(id);
            if (complexity is not null)
                return await context.Complexity.Where(w => w.Name == complexity.Name).ToListAsync();
            return new List<Complexity>();
        }

        public async Task<Complexity> AddComplexity(string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            Complexity complexity = new();
            complexity.Name = name;
            await context.Complexity.AddAsync(complexity);
            if (await context.SaveChangesAsync() > 0)
            {
                return complexity;
            }
            return null;
        }
        public async Task<List<Complexity>> LoadComplexity()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.Complexity.ToListAsync();
        }

        public async Task<bool> DeleteComplexity(int id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var complexity = await context.Complexity.FindAsync(id);
            if (complexity is not null)
            {
                context.Complexity.Remove(complexity);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Complexity> EditComplexity(int id, string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var complexity = await context.Complexity.FindAsync(id);
            if (complexity is not null)
            {
                complexity.Name = name;
                context.Complexity.Update(complexity);
                if (await context.SaveChangesAsync() > 0)
                {
                    return complexity;
                }
            }
            return null;
        }
    }
}
