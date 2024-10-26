using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
	public interface IOrganizationService
	{
		Task<List<Organization>> GetOrganizations();
		Task<Organization> AddOrganization(string name, string logo, string website, string copyright);
		Task<bool> DeleteOrganization(Guid id);
		Task<Organization> EditOrganization(Guid id, string name, string logo, string website, string copyright);
    }
}
