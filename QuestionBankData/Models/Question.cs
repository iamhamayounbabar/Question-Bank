using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;
public enum QuestionTypes
{
    MultipleChoice,//Radio button
    FillInTheBlanks,
	Matching,
	List,//multiple Textbox WYUy
	ShortSnswer,//Textarea WYUy
	Checklist,
    TrueFalse,
	Essay,//Textarea WYUy
	Diagram,//Textarea WYUy
}

public partial class Question
{
    [Key]
    public Guid Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [Required]
    public bool IsPublished { get; set; }

    [InverseProperty("Question")]
    public virtual ICollection<AnswerOption> AnswerOption { get; } = new List<AnswerOption>();

    [InverseProperty("QuestionNavigation")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();
}