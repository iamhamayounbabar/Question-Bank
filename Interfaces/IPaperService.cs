using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
    public interface IPaperService
    {
        Task<List<PaperVersions>> GetPapers();
        Task<bool> DeletePaper(Guid id);
        Task<Guid?> UpdatePaper(Guid id, AddPaperRequest paperRequest);
        Task<bool> AddPaper(AddPaperRequest paperRequest);
        Task<PaperVersions> GetPaperByVersionId(Guid id);
        Task<PaperVersions> SubmitForApproval(Guid id);
        Task<List<PaperVersions>> GetPapersForApproval();
    }
}
