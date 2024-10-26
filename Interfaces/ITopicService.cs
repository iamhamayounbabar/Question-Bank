using QuestionBankData.Models;

namespace QuestionBank.Interfaces
{
	public interface ITopicService
	{
		Task<List<Topic>> GetTopics(Guid id);
		Task<Topic> AddTopic(string name, Guid? parentTopicId, Guid subjectId);
		Task<List<Topic>> LoadTopics();
		Task<bool> DeleteTopic(Guid id);
    }
}
