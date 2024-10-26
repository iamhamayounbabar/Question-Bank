using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QuestionBank.Interfaces;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using System.Security.Claims;

namespace QuestionBank.Services
{
	public class TopicService : ITopicService
	{

		private readonly IServiceScopeFactory factory;
        private readonly IHttpContextAccessor userContext;

        public TopicService(IServiceScopeFactory factory, IHttpContextAccessor userContext)
		{
			this.factory = factory;
            this.userContext = userContext;

        }

        public async Task<List<Topic>> GetTopics(Guid id)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            return await context.Topic.Include(i => i.ParentTopicNavigation).Where(w => w.SubjectId == id).ToListAsync();
        }

		public async Task<Topic> AddTopic(string name, Guid? parentTopicId, Guid subjectId)
		{
			using var scope = factory.CreateScope();
			var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
			var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

			Topic topic = new();
            topic.Name = name;
            topic.ParentTopic = parentTopicId;
			topic.SubjectId = subjectId;
			topic.CreatedBy = userId;
			await context.Topic.AddAsync(topic);
            if (await context.SaveChangesAsync() > 0)
			{
                topic.Subject = await context.Subject.FindAsync(subjectId);
                topic.ParentTopicNavigation = topic.ParentTopic != Guid.Empty ? await context.Topic.FirstOrDefaultAsync(f => f.Id == topic.ParentTopic) : null;
				return topic;
            }
			return null;
		}
        public async Task<List<Topic>> LoadTopics()
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();

            return await context.Topic.Include(i => i.Subject).ToListAsync();
        }
        public async Task<bool> DeleteTopic(Guid id)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var topic = await context.Topic.FindAsync(id);
            if (topic is not null)
            {
                context.Topic.Remove(topic);
                if (await context.SaveChangesAsync() > 0)
                {
                    return true;
                }
            }
            return false;
        }

        public async Task<Topic> EditTopic(Guid id, string name)
        {
            using var scope = factory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<QuestionBankContext>();
            var userId = userContext.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            var topic = await context.Topic.FindAsync(id);
            if (topic is not null)
            {
                topic.Name = name;
                context.Topic.Update(topic);
                if (await context.SaveChangesAsync() > 0)
                {
                    return topic;
                }
            }
            return null;
        }

    }
}
