using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
	public class OrganizationService : IOrganizationService
	{
		private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;

        public OrganizationService(IServiceScopeFactory factory, IHttpContextAccessor userContext)
		{
			this.factory = factory;
            this.userContext = userContext;
        }
        public async Task<List<Organization>> GetOrganizations()
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

			return await context.Organization.OrderByDescending(o => o.DateCreated).ToListAsync();
		}

        public async Task<Organization> AddOrganization(string name, string logo, string website, string copyright)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            Organization organization = new();
            organization.Name = name;
            organization.Logo = logo;
            organization.Website = website;
            organization.CopyRight = copyright;
			organization.CreatedBy = userId;
            await context.Organization.AddAsync(organization);
            if (await context.SaveChangesAsync() > 0)
            {
                return organization;
            }
            return null;
        }

        public async Task<bool> DeleteOrganization(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var organization = await context.Organization.FindAsync(id);
            if (organization is not null)
            {
                context.Organization.Remove(organization);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Organization> EditOrganization(Guid id, string name, string logo, string website, string copyright)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var organization = await context.Organization.FindAsync(id);
            if (organization is not null)
            {
				organization.Name = name;
				organization.Logo = logo;
				organization.Website = website;
				organization.CopyRight = copyright;
				organization.ModifiedBy = userId;
                organization.DateModified = DateTime.UtcNow;
				context.Organization.Update(organization);
                if (await context.SaveChangesAsync() > 0)
                {
                    return organization;
                }
            }
            return null;
        }
    }
}
