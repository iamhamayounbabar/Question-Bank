using QuestionBank.Services;
using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
    public interface IPaperTypeService
    {
        Task<PaperType> AddPaperType(string name);
        Task<bool> DeletePaperType(int id);
        Task<PaperType> EditPaperType(int id, string name);
        Task<List<PaperType>> GetPaperType(int id);
        Task<List<PaperType>> LoadPaperTypes();
    }
}
