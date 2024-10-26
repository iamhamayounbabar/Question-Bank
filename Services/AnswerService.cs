using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models.Api_Models;
using QuestionBankData.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace QuestionBank.Services
{
    public class AnswerService : IAnswerService
    {
        private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;
        public AnswerService(IServiceScopeFactory factory, IHttpContextAccessor userContext)

        {
            this.factory = factory;
            this.userContext = userContext;
        }
        public async Task<List<AnswerOptionVersions>?> AddUpdateAnswers(Guid id, List<AddAnswersRequest> answersRequests)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            int res = 0;
            List<AnswerOptionVersions> answers = new();
            foreach (var answersRequest in answersRequests)
            {
                if (answersRequest.AnsId is not null)
                {
					var existingAnswerOption = await context.AnswerOptionVersions.FindAsync(answersRequest.AnsId);

					if (existingAnswerOption != null)
					{
						AnswerOptionVersions answerOptionVersion = new();
						answerOptionVersion.AnswerCode = answersRequest.AnsCode;
						answerOptionVersion.Answer = answersRequest.Ans;
						answerOptionVersion.IsCorrectAnswer = answersRequest.IsCorrect;
						answerOptionVersion.CreatedBy = userId;
						answerOptionVersion.AnswerOptionId = existingAnswerOption.AnswerOptionId;
						answerOptionVersion.VersionNumber = existingAnswerOption.VersionNumber + 1;
						await context.AnswerOptionVersions.AddAsync(answerOptionVersion);
						res += await context.SaveChangesAsync();
						if (res > 0)
						{
							answers.Add(answerOptionVersion);
						}
					}
				}
                else
                {
                    AnswerOption answer = new();
                    answer.CreatedBy = userId;
                    answer.QuestionId = id;
                    await context.AnswerOption.AddAsync(answer);
                    if (await context.SaveChangesAsync() > 0)
                    {
                        AnswerOptionVersions answerOptionVersion = new();
                        answerOptionVersion.AnswerCode = answersRequest.AnsCode;
                        answerOptionVersion.Answer = answersRequest.Ans;
                        answerOptionVersion.IsCorrectAnswer = answersRequest.IsCorrect;
                        answerOptionVersion.CreatedBy = userId;
                        answerOptionVersion.AnswerOptionId = answer.Id;
                        answerOptionVersion.VersionNumber = 1;
                        await context.AnswerOptionVersions.AddAsync(answerOptionVersion);
                        res += await context.SaveChangesAsync();
						if (res > 0)
						{
							answers.Add(answerOptionVersion);
						}
					}
                }
            }
            if (res > 0)
            {
                return answers;
            }
            return null;
        }
        public async Task<AnswerOptionVersions> MarAnswerApproved(Guid id, List<AddAnswersRequest> answersRequests)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);


            int res = 0;
            List<AnswerOptionVersions> answers = new();
            foreach (var answersRequest in answersRequests)
            {
                if (answersRequest.AnsId is not null)
                {
                    var existingAnswerOption = await context.AnswerOptionVersions.FindAsync(answersRequest.AnsId);

                    if (existingAnswerOption != null)
                    {
                        AnswerOptionVersions answerOptionVersion = new();
                        answerOptionVersion.AnswerCode = answersRequest.AnsCode;
                        answerOptionVersion.Answer = answersRequest.Ans;
                        answerOptionVersion.IsCorrectAnswer = answersRequest.IsCorrect;
                        answerOptionVersion.CreatedBy = userId;
                        //answerOptionVersion.Status = context.ReviewStatus.First(f => f.Name == "ApprovedAll").Id;
                        answerOptionVersion.AnswerOptionId = existingAnswerOption.AnswerOptionId;
                        answerOptionVersion.VersionNumber = existingAnswerOption.VersionNumber + 1;
                        await context.AnswerOptionVersions.AddAsync(answerOptionVersion);
                        res += await context.SaveChangesAsync();
                        if (res > 0)
                        {
                            answers.Add(answerOptionVersion);
                        }
                    }
                }
                else
                {
                    AnswerOption answer = new();
                    answer.CreatedBy = userId;
                    answer.QuestionId = id;
                    await context.AnswerOption.AddAsync(answer);
                    if (await context.SaveChangesAsync() > 0)
                    {
                        AnswerOptionVersions answerOptionVersion = new();
                        answerOptionVersion.AnswerCode = answersRequest.AnsCode;
                        answerOptionVersion.Answer = answersRequest.Ans;
                        answerOptionVersion.IsCorrectAnswer = answersRequest.IsCorrect;
                        answerOptionVersion.CreatedBy = userId;
                        //answerOptionVersion.Status = context.ReviewStatus.First(f => f.Name == "ApprovedAll").Id;
                        answerOptionVersion.AnswerOptionId = answer.Id;
                        answerOptionVersion.VersionNumber = 1;
                        await context.AnswerOptionVersions.AddAsync(answerOptionVersion);
                        res += await context.SaveChangesAsync();
                        if (res > 0)
                        {
                            answers.Add(answerOptionVersion);
                        }
                    }
                }
            }
            return null;
        }
    }


}

