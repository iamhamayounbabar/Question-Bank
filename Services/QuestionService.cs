using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;
using System.Collections.Generic;
using System.Security.Claims;

namespace QuestionBank.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        public QuestionService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.userContext = userContext;
        }

        public async Task<List<QuestionGroupResponse>> GetQuestionGroups()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.QuestionGroup.Include(i => i.QuestionGroupVersions)
                .Select(sel => new QuestionGroupResponse { Id = sel.Id, Name = sel.QuestionGroupVersions.OrderByDescending(o => o.VersionNumber).First().Title })
                .ToListAsync();
        }

        public async Task<List<QuestionType>> GetQuestionTypes()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.QuestionType.ToListAsync();
        }

        public async Task<List<Complexity>> GetComplexities()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.Complexity.ToListAsync();
        }

		public async Task<bool> AddQuestion(AddQuestionRequest questionRequest)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

			Question question = new();
            question.CreatedBy = userId;
            await context.Question.AddAsync(question);
            if(await context.SaveChangesAsync() > 0)
            {
				QuestionVersions questionVersion = new();
				questionVersion.Question = questionRequest.Question;
                questionVersion.QuestionGroupId = questionRequest.QuestionGroup != Guid.Empty ? questionRequest.QuestionGroup : null;
                questionVersion.TopicId = questionRequest.Topic;
                questionVersion.OrganizationId = questionRequest.Organization;
                questionVersion.MarkingScheme = questionRequest.MarkScheme;
                questionVersion.Score = questionRequest.Marks;
                questionVersion.QuestionTypeId = questionRequest.QuestionType;
                questionVersion.ComplexityId = questionRequest.Complexity;
                questionVersion.Hint = questionRequest.Hint;
                questionVersion.VideoLink = questionRequest.VideoLink;
                questionVersion.Solution = questionRequest.Solution;
                questionVersion.QuestionReferences = questionRequest.QuestionReferences;
                questionVersion.YearGroupId = questionRequest.YearGroup;
				questionVersion.CreatedBy = userId;
                questionVersion.QuestionId = question.Id;
                questionVersion.VersionNumber = 1;
                questionVersion.IsDraft = true;
                questionVersion.Status = context.ReviewStatus.First(f => f.Name == "New").Id;

                await context.QuestionVersions.AddAsync(questionVersion);
                if(await context.SaveChangesAsync() > 0)
                {
                    TagRelations relation = null;
                    questionRequest.Tags.ForEach(tag =>
                    {
                        relation = new();
                        relation.RelationId = questionVersion.Id.ToString("D");
                        relation.TagId = tag.Id;
                        relation.CreatedBy = userId;
                        context.TagRelations.Add(relation);
                    });
                    await context.SaveChangesAsync();
                    return true;
                }
			}
            return false;
		}

		public async Task<List<YearGroup>> GetYearGroups()
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

			return await context.YearGroup.ToListAsync();
		}

        public async Task<List<QuestionVersions>> GetQuestions()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questions = await context.QuestionVersions
                .Where(w => w.CreatedBy == userId)
                .Include(i => i.Complexity)
                .Include(i => i.Organization)
                .Include(i => i.YearGroup)
                .Include(i => i.Topic)
                .Include(i => i.QuestionGroup)
                .Include(i => i.QuestionType)
                .Include(i => i.StatusNavigation)
				.GroupBy(g => g.QuestionId)
                .Select(s => s.OrderByDescending(o => o.VersionNumber).First())
                .ToListAsync();

            questions.ForEach(q =>
            {
                var user = context.Users.Find(q.CreatedBy);
                q.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
                if (q.QuestionGroupId != null)
                {
                    q.QuestionGroupVersion = context.QuestionGroupVersions
                    .Where(w => w.QuestionGroupId == q.QuestionGroupId).OrderByDescending(o => o.VersionNumber).First();
                }
            });

            return questions;
        }

        public async Task<bool> DeleteQuestion(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var question = await context.Question.FindAsync(id);
            var allVersions = await context.QuestionVersions.Where(w => w.QuestionId == question.Id).ToListAsync();
            if (question != null)
            {
                context.Question.Remove(question);
                if(await context.SaveChangesAsync() > 0)
                {
                    allVersions.ForEach(v =>
                    {
                        var tags = context.TagRelations.Where(w => w.RelationId == v.Id.ToString("D")).ToList();
                        context.TagRelations.RemoveRange(tags);
                    });

                    var reviewComments = await context.ReviewComment.Where(w => w.RelatedTo == id.ToString("D")).ToListAsync();
                    context.ReviewComment.RemoveRange(reviewComments);

                    await context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
        
        public async Task<QuestionVersions> GetQuestionByVersionId(Guid id)
        {
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var question = await context.QuestionVersions.Include(i => i.Topic).Include(i => i.StatusNavigation).FirstOrDefaultAsync(q => q.Id == id);
            if(question != null)
            {
                var ans = await context.AnswerOptionVersions
                    .Include(i => i.AnswerOption)
                    .Where(w => w.AnswerOption.QuestionId == question.QuestionId).ToListAsync();

                var ag = ans.GroupBy(g => g.AnswerOptionId).ToList();

				question.Answers = ag
					.Select(sel => sel.OrderByDescending(o => o.DateCreated).First()).ToList();

                question.Tags = await context.TagRelations
                    .Include(i => i.Tag)
                    .Where(w => w.RelationId == question.Id.ToString("D"))
                    .Select(sel => new TagRequest { Id = sel.TagId, Name = sel.Tag.Tag1 })
                    .ToListAsync();

                return question;
            }
            return null;
		}

        public async Task<Guid?> UpdateQuestion(Guid id, AddQuestionRequest questionRequest)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questionVersionExisting = await context.QuestionVersions.FindAsync(id);
            if(questionVersionExisting is not null)
            {
                QuestionVersions questionVersion = new();
                questionVersion.Question = questionRequest.Question;
                questionVersion.QuestionGroupId = questionRequest.QuestionGroup;
                questionVersion.TopicId = questionRequest.Topic;
                questionVersion.OrganizationId = questionRequest.Organization;
                questionVersion.MarkingScheme = questionRequest.MarkScheme;
                questionVersion.Score = questionRequest.Marks;
                questionVersion.QuestionTypeId = questionRequest.QuestionType;
                questionVersion.ComplexityId = questionRequest.Complexity;
                questionVersion.Hint = questionRequest.Hint;
                questionVersion.YearGroupId = questionRequest.YearGroup;
                questionVersion.VideoLink = questionRequest.VideoLink;
                questionVersion.Solution = questionRequest.Solution;
                questionVersion.QuestionReferences = questionRequest.QuestionReferences;
                questionVersion.CreatedBy = userId;
                questionVersion.QuestionId = questionVersionExisting.QuestionId;
                questionVersion.VersionNumber = questionVersionExisting.VersionNumber + 1;
                questionVersion.Status = context.ReviewStatus.First(f => f.Name == "New").Id;

                await context.QuestionVersions.AddAsync(questionVersion);
                if (await context.SaveChangesAsync() > 0)
                {

                    TagRelations relation = null;
                    questionRequest.Tags.ForEach(tag =>
                    {
                        relation = new();
                        relation.RelationId = questionVersion.Id.ToString("D");
                        relation.TagId = tag.Id;
                        relation.CreatedBy = userId;
                        context.TagRelations.Add(relation);
                    });
                    await context.SaveChangesAsync();
                    return questionVersion.Id;

                }
            }
            return null;
        }

        public async Task<QuestionVersions> SubmitForApproval(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questionVersionExisting = await context.QuestionVersions.FindAsync(id);
            if (questionVersionExisting is not null)
            {
                var tags = await context.TagRelations.Where(w => w.RelationId == questionVersionExisting.Id.ToString("D")).ToListAsync();

                questionVersionExisting.Id = Guid.Empty;
                questionVersionExisting.IsDraft = false;
                questionVersionExisting.VersionNumber = questionVersionExisting.VersionNumber + 1;
                questionVersionExisting.Status = context.ReviewStatus.First(f => f.Name == "PendingReview").Id;
                questionVersionExisting.DateCreated = DateTime.UtcNow;

                await context.QuestionVersions.AddAsync(questionVersionExisting);
                if (await context.SaveChangesAsync() > 0)
                {
                    for (int i = 0; i < tags.Count; i++)
                    {
                        tags[i].Id = Guid.Empty;
                        tags[i].RelationId = questionVersionExisting.Id.ToString("D");
                        tags[i].DateCreated = DateTime.UtcNow;
                    }

                    await context.TagRelations.AddRangeAsync(tags);
                    await context.SaveChangesAsync();

                    questionVersionExisting.StatusNavigation = context.ReviewStatus.First(f => f.Id == questionVersionExisting.Status);

                    questionVersionExisting.Tags = await context.TagRelations
                    .Include(i => i.Tag)
                    .Where(w => w.RelationId == questionVersionExisting.Id.ToString("D"))
                    .Select(sel => new TagRequest { Id = sel.TagId, Name = sel.Tag.Tag1 })
                    .ToListAsync();

                    return questionVersionExisting;
                }
            }
            return null;
        }

        public async Task<List<QuestionVersions>> GetQuestionsForApproval()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var status = context.ReviewStatus.First(f => f.Name == "PendingReview").Id;


            var questions = await context.QuestionVersions
                .Include(i => i.Complexity)
                .Include(i => i.Organization)
                .Include(i => i.YearGroup)
                .Include(i => i.Topic)
                .Include(i => i.QuestionGroup)
                .Include(i => i.QuestionType)
                .Include(i => i.StatusNavigation)
                .GroupBy(g => g.QuestionId)
                .Select(s => s.OrderByDescending(o => o.VersionNumber).First())
                .ToListAsync();

            questions.ForEach(q =>
            {
                var user = context.Users.Find(q.CreatedBy);
                
                q.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
                if (q.QuestionGroupId != null)
                {
                    q.QuestionGroupVersion = context.QuestionGroupVersions
                    .Where(w => w.QuestionGroupId == q.QuestionGroupId).OrderByDescending(o => o.VersionNumber).First();
                }
            });

            return questions.Where(w => w.Status == status || w.ReviewedBy == userId).ToList();
        }

        public async Task<QuestionVersions> MarkQuestionApproved(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var questionVersionExisting = await context.QuestionVersions
                .Include(i => i.Complexity)
                .Include(i => i.Organization)
                .Include(i => i.YearGroup)
                .Include(i => i.Topic)
                .Include(i => i.QuestionGroup)
                .Include(i => i.QuestionType)
                .FirstOrDefaultAsync(f => f.Id == id);
            if (questionVersionExisting is not null)
            {
                var tags = await context.TagRelations.Where(w => w.RelationId == questionVersionExisting.Id.ToString("D")).ToListAsync();

                questionVersionExisting.Id = Guid.Empty;
                questionVersionExisting.IsReady = true;
                questionVersionExisting.VersionNumber = questionVersionExisting.VersionNumber + 1;
                questionVersionExisting.Status = context.ReviewStatus.First(f => f.Name == "Approved").Id;
                questionVersionExisting.DateCreated = DateTime.UtcNow;
                questionVersionExisting.ReviewedBy = userId;

                await context.QuestionVersions.AddAsync(questionVersionExisting);
                if (await context.SaveChangesAsync() > 0)
                {
                    for(int i = 0; i < tags.Count; i++)
                    {
                        tags[i].Id = Guid.Empty;
                        tags[i].RelationId = questionVersionExisting.Id.ToString("D");
                        tags[i].DateCreated = DateTime.UtcNow;
                    }

                    await context.TagRelations.AddRangeAsync(tags);
                    await context.SaveChangesAsync();

                    questionVersionExisting.StatusNavigation = context.ReviewStatus.First(f => f.Id == questionVersionExisting.Status);

                    var user = context.Users.Find(questionVersionExisting.CreatedBy);

                    questionVersionExisting.User = new AspNetUser { Name = user.Name, Email = user.Email, Id = user.Id };
                    if (questionVersionExisting.QuestionGroupId != null)
                    {
                        questionVersionExisting.QuestionGroupVersion = context.QuestionGroupVersions
                        .Where(w => w.QuestionGroupId == questionVersionExisting.QuestionGroupId).OrderByDescending(o => o.VersionNumber).First();
                    }

                    questionVersionExisting.Tags = await context.TagRelations
                    .Include(i => i.Tag)
                    .Where(w => w.RelationId == questionVersionExisting.Id.ToString("D"))
                    .Select(sel => new TagRequest { Id = sel.TagId, Name = sel.Tag.Tag1 })
                    .ToListAsync();

                    return questionVersionExisting;
                }
            }
            return null;
        }

        public async Task<ReviewComment?> GetReviewComment(Guid questionId)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.ReviewComment
                        .Where(w => w.RelatedTo == questionId.ToString("D"))
                        .OrderByDescending(o => o.DateCreated)
                        .FirstOrDefaultAsync();
        }


        public async Task<QuestionVersions?> AddReviewComment(string reviewComment, Guid relatedTo)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var question = await context.QuestionVersions
                .Include(i => i.Topic).Include(i => i.StatusNavigation)
                .Where(w => w.QuestionId == relatedTo)
                .OrderByDescending(o => o.VersionNumber).FirstOrDefaultAsync();
            //var answer = await context.AnswerOptionVersions.FirstOrDefaultAsync(f => f.Id == relatedTo);
            if (question is not null)
            {
                var tags = await context.TagRelations.Where(w => w.RelationId == question.Id.ToString("D")).ToListAsync();

                question.Id = Guid.Empty;
                question.Status = context.ReviewStatus.First(f => f.Name == "PendingChanges").Id;
                question.VersionNumber = question.VersionNumber + 1;
                question.DateCreated = DateTime.UtcNow;
                context.QuestionVersions.Add(question);
                if (await context.SaveChangesAsync() > 0)
                {
                    ReviewComment questionReview = new();
                    questionReview.Comment = reviewComment;
                    questionReview.CreatedBy = userId;
                    questionReview.RelatedTo = relatedTo.ToString("D");

                    await context.ReviewComment.AddAsync(questionReview);
                    if (await context.SaveChangesAsync() > 0)
                    {
                        for (int i = 0; i < tags.Count; i++)
                        {
                            tags[i].Id = Guid.Empty;
                            tags[i].RelationId = question.Id.ToString("D");
                            tags[i].DateCreated = DateTime.UtcNow;
                        }

                        await context.TagRelations.AddRangeAsync(tags);
                        await context.SaveChangesAsync();

                        question.StatusNavigation = context.ReviewStatus.First(f => f.Id == question.Status);

                        var ans = await context.AnswerOptionVersions
                        .Include(i => i.AnswerOption)
                        .Where(w => w.AnswerOption.QuestionId == question.QuestionId).ToListAsync();

                        var ag = ans.GroupBy(g => g.AnswerOptionId).ToList();

                        question.Answers = ag
                            .Select(sel => sel.OrderByDescending(o => o.DateCreated).First()).ToList();

                        question.Tags = await context.TagRelations
                            .Include(i => i.Tag)
                            .Where(w => w.RelationId == question.Id.ToString("D"))
                            .Select(sel => new TagRequest { Id = sel.TagId, Name = sel.Tag.Tag1 })
                            .ToListAsync();

                        return question;
                    }
                }
                //else if(answer is not null)
                //{
                //    answer.Status = context.ReviewStatus.First(f => f.Name == "PendingChanges").Id;
                //    context.QuestionVersions.Update(question);
                //}
            }

            return null;
        }
    }
}
