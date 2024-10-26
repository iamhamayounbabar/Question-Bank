using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
    public interface IQuestionTypeService
    {
        Task<List<QuestionType>> GetQuestionType(int id);
        Task<QuestionType> AddQuestionType(string name);
        Task<List<QuestionType>> LoadQuestionTypes();
        Task<bool> DeleteQuestionType(int id);
        Task<QuestionType> EditQuestionType(int id, string name);
    }
}
