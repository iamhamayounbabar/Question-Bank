using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
    public interface IAnswerService
    {
		Task<List<AnswerOptionVersions>?> AddUpdateAnswers(Guid id,List<AddAnswersRequest> answersRequests);
        Task<AnswerOptionVersions> MarAnswerApproved(Guid id, List<AddAnswersRequest> answersRequests);

    }
}
