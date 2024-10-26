using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models.Api_Models;
using QuestionBankData.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace QuestionBank.Services
{
    public class PaperService : IPaperService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;

        public PaperService (IServiceScopeFactory factory, IHttpContextAccessor userContext)
        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<List<PaperVersions>> GetPapers()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var paperVersions = await context.PaperVersions
                .Where(pv => pv.CreatedBy == userId)
                .Include(pv => pv.PaperType)
                .Include(pv => pv.YearGroup)
                .Include(pv => pv.Organization)
                .Include(pv => pv.StatusNavigation)
                .GroupBy(pv => pv.PaperId)
                .Select(g => g.OrderByDescending(pv => pv.VersionNumber).First())
                .ToListAsync();

            paperVersions.ForEach(p =>
            {
                var user = context.Users.Find(p.CreatedBy);
                p.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
            });

            return paperVersions;
        }

        public async Task<PaperVersions> GetPaperByVersionId(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var paper = await context.PaperVersions.Include(i => i.PaperType).Include(i => i.StatusNavigation).FirstOrDefaultAsync(q => q.Id == id);
           if(paper is not null)
            {
                return paper;
            }
            return null;
        }


        public async Task<bool> AddPaper(AddPaperRequest paperRequest)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);


            Paper paper = new();
            paper.CreatedBy = userId;
            await context.Paper.AddAsync(paper);
            if (await context.SaveChangesAsync() > 0)
            {   
                PaperVersions paperVersion = new();
                paperVersion.Id = Guid.NewGuid();
                paperVersion.Header = paperRequest.Header;
                paperVersion.OrganizationId = paperRequest.Organization;
                paperVersion.PaperTypeId = paperRequest.PaperType;
                paperVersion.Footer = paperRequest.Footer;
                paperVersion.TimeAllowed = paperRequest.TimeAllowed;
                paperVersion.Name = paperRequest.Name;
                paperVersion.PaperId = paper.Id;
                paperVersion.YearGroupId = paperRequest.YearGroup;
                paperVersion.CreatedBy = userId;
                paperVersion.VersionNumber = 1;
                paperVersion.IsDraft = true;
                paperVersion.Status = context.ReviewStatus.First(f => f.Name == "New").Id;

                await context.PaperVersions.AddAsync(paperVersion);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> DeletePaper(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var paper = await context.Paper.FindAsync(id);
            if (paper != null)
            {
                context.Paper.Remove(paper);
                if (await context.SaveChangesAsync() > 0)
                {
                    var reviewComments = await context.ReviewComment.Where(w => w.RelatedTo == id.ToString("D")).ToListAsync();
                    context.ReviewComment.RemoveRange(reviewComments);

                    await context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }

        public async Task<Guid?> UpdatePaper(Guid id, AddPaperRequest paperRequest)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var paperVersionExisting = await context.PaperVersions.FindAsync(id);
            if (paperVersionExisting is not null)
            {
                PaperVersions PaperVersion = new();
                PaperVersion.Header = paperRequest.Header;
                PaperVersion.Footer = paperRequest.Footer;
                PaperVersion.Name = paperRequest.Name;
                PaperVersion.OrganizationId = paperRequest.Organization;
                PaperVersion.YearGroupId = paperRequest.YearGroup;
                PaperVersion.PaperTypeId = paperRequest.PaperType;
                PaperVersion.TimeAllowed = paperRequest.TimeAllowed;
                PaperVersion.CreatedBy = userId;
                PaperVersion.PaperId = paperVersionExisting.PaperId;
                PaperVersion.VersionNumber = paperVersionExisting.VersionNumber + 1;
                PaperVersion.Status = context.ReviewStatus.First(f => f.Name == "New").Id;

                await context.PaperVersions.AddAsync(PaperVersion);
                if (await context.SaveChangesAsync() > 0)
                {
                    return PaperVersion.Id;
                }
            }
            return null;
        }
        public async Task<PaperVersions> SubmitForApproval(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var paperVersionExisting = await context.PaperVersions.FindAsync(id);
            if (paperVersionExisting is not null)
            {
                paperVersionExisting.Id = Guid.Empty;
                paperVersionExisting.IsDraft = false;
                paperVersionExisting.VersionNumber = paperVersionExisting.VersionNumber + 1;
                paperVersionExisting.Status = context.ReviewStatus.First(f => f.Name == "PendingReview").Id;
                paperVersionExisting.DateCreated = DateTime.UtcNow;

                await context.PaperVersions.AddAsync(paperVersionExisting);
                paperVersionExisting.StatusNavigation = context.ReviewStatus.First(f => f.Id == paperVersionExisting.Status);


                return paperVersionExisting;
            }
            return null;
        }

        public async Task<List<PaperVersions>> GetPapersForApproval()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var status = context.ReviewStatus.First(f => f.Name == "PendingReview").Id;


            var papers = await context.PaperVersions
                .Include(pv => pv.PaperType)
                .Include(pv => pv.YearGroup)
                .Include(pv => pv.Organization)
                .Include(pv => pv.StatusNavigation)
                .GroupBy(pv => pv.PaperId)
                .Select(s => s.OrderByDescending(o => o.VersionNumber).First())
                .ToListAsync();

            papers.ForEach(q =>
            {
                var user = context.Users.Find(q.CreatedBy);

                q.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
            });
            return papers.Where(w => w.Status == status || w.ReviewedBy == userId).ToList();
        }

    }
}
