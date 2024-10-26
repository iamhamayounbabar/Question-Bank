using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuestionBankData.Models.Api_Models
{
	#nullable enable
	public class AddQuestionRequest
	{
		public string Question { get; set; }
		public string? Hint { get; set; }
		public string? MarkScheme { get; set; }
		public string Subject { get; set; }
		public int Marks { get; set; }
		public Guid Topic { get; set; }
		public int Complexity { get; set; }
		public Guid? QuestionGroup { get; set; }
		public Guid Organization { get; set; }
		public int QuestionType { get; set; }
		public int YearGroup { get; set; }
		public string? VideoLink { get; set; }
		public string? Solution { get; set; }
		public string? QuestionReferences { get; set; }
		public List<TagRequest> Tags { get; set; }
	}
}
