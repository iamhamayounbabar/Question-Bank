using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
    public interface IQuestionGroupService
    {
        Task<bool> AddQuestionGroup(AddQuestionGroupRequest questionGroupRequest);
        Task<bool> DeleteQuestionGroup(Guid id);
        Task<Guid?> UpdateQuestionGroup(Guid id, AddQuestionGroupRequest questionGroupRequest);
        Task<QuestionGroupVersions> GetQuestionGroupByVersionId(Guid id);
        Task<List<QuestionGroupVersions>> GetQuestionGroups();
    }
}
