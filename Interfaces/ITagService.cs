using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
    public interface ITagService
    {
        Task<Tag> AddTag(string name);
        Task<bool> DeleteTag(Guid id);
        Task<List<Tag>> LoadTags();
        Task<Tag> EditTag(Guid id, string name);
        Task<List<Tag>> GetTags();
    }
}
