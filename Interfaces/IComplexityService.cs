using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
    public interface IComplexityService
    {
        Task<List<Complexity>> GetComplexity(int id);
        Task<Complexity> AddComplexity(string name);
        Task<List<Complexity>> LoadComplexity();
        Task<bool> DeleteComplexity(int id);
        Task<Complexity> EditComplexity(int id, string name);
    }
}
