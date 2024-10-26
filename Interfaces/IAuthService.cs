using Microsoft.AspNetCore.Identity;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
    public interface IAuthService
    {
        Task<ReturnResponse> LoginUser(Login model);
        Task<ReturnResponse> RegisterUser(Users model);
        Task<bool> IsAuthenticated();
        Task<List<AspNetUser>> GetAllNonAdminUsers();
	}
}
