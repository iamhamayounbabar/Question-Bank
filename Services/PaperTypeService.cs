using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
    public class PaperTypeService : IPaperTypeService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        private object?[]? id;

        public PaperTypeService(IServiceScopeFactory factory, IHttpContextAccessor userContext)
        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<PaperType> AddPaperType(string name)
        {
            using var scope = this.factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            PaperType paperType = new();
            paperType.Name = name;
            await context.PaperType.AddAsync(paperType);
            if(await context.SaveChangesAsync() > 0)
            {
                return paperType;
            }
            return null;
        }

        public async Task<bool> DeletePaperType(int id)
        {
            using var scope = this.factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var paperType = await context.PaperType.FindAsync(id);
            if(paperType is not null)
            {
                context.PaperType.Remove(paperType);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<PaperType> EditPaperType(int id, string name)
        {
            using var scope = this.factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var paperType = await context.PaperType.FindAsync(id);
            if(paperType is not null)
            {
                paperType.Name = name;
                context.PaperType.Update(paperType);
                if (await context.SaveChangesAsync() > 0)
                {
                    return paperType;
                }
            }
            return null;
        }

        public async Task<List<PaperType>> GetPaperType(int id)
        {
            using var scope = this.factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var paperType = await context.PaperType.FindAsync(id);
            if (paperType is not null)
                return await context.PaperType.Where(w => w.Name == paperType.Name).ToListAsync();
            return new List<PaperType>();
        }

        public async Task<List<PaperType>> LoadPaperTypes()
        {
            using var scope = this.factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            return await context.PaperType.ToListAsync();
        }
    }
}
