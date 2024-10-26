using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
    public interface IQuestionService
    {
        Task<bool> AddQuestion(AddQuestionRequest questionRequest);
        Task<List<QuestionVersions>> GetQuestions();
        Task<List<YearGroup>> GetYearGroups();
		Task<List<QuestionGroupResponse>> GetQuestionGroups();
		Task<List<QuestionType>> GetQuestionTypes();
        Task<List<Complexity>> GetComplexities();
        Task<bool> DeleteQuestion(Guid id);
        Task<QuestionVersions> GetQuestionByVersionId(Guid id);
        Task<Guid?> UpdateQuestion(Guid id, AddQuestionRequest questionRequest);
        Task<QuestionVersions> SubmitForApproval(Guid id);
        Task<List<QuestionVersions>> GetQuestionsForApproval();
        Task<QuestionVersions> MarkQuestionApproved(Guid id);
        Task<ReviewComment?> GetReviewComment(Guid questionId);
        Task<QuestionVersions?> AddReviewComment(string reviewComment, Guid relatedTo);

    }
}
