using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;

namespace QuestionBank.Interfaces
{
	public interface ISubjectService
	{
		Task<List<SubjectResponse>> GetSubjectsByUser(bool showAll);
		Task<List<Subject>> LoadSubjects();
		Task<Subject> AddSubject(string name);
		Task<Subject> EditSubject(Guid id, string name);
		Task<SubjectUser> AssignSubject(string userId, Guid subjectId);
		Task<bool> DeleteSubject(Guid id);
		Task<List<SubjectUser>> LoadAssignedSubjects();
		Task<bool> UnassignSubject(Guid id);
	}
}
