using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
    public class TagService :ITagService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;

        public TagService (IServiceScopeFactory factory, IHttpContextAccessor userCuserContext)
        {
            this.factory = factory;
            this.userContext = userCuserContext;
        }

        public async Task<List<Tag>> GetTags()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.Tag.ToListAsync();
        }

        public async Task<Tag> AddTag(string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            Tag tag = new();
            tag.Tag1 = name;
            tag.CreatedBy = userId;
            await context.Tag.AddAsync(tag);
            if (await context.SaveChangesAsync() > 0)
            {
                return tag;
            }
            return null;
        }

        public async Task<bool> DeleteTag(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var tag = await context.Tag.FindAsync(id);
            if (tag is not null)
            {
                context.Tag.Remove(tag);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<List<Tag>> LoadTags()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.Tag.ToListAsync();
        }


        public async Task<Tag> EditTag(Guid id, string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var tag = await context.Tag.FindAsync(id);
            if (tag is not null)
            {
                tag.Tag1 = name;
                tag.ModifiedBy = userId;
                tag.DateModified = DateTime.UtcNow;
                context.Tag.Update(tag);
                if (await context.SaveChangesAsync() > 0)
                {
                    return tag;
                }
            }
            return null;
        }
    }
}
