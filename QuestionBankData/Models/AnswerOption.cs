using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class AnswerOption
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid QuestionId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [InverseProperty("AnswerOption")]
    public virtual ICollection<AnswerOptionVersions> AnswerOptionVersions { get; } = new List<AnswerOptionVersions>();

    [ForeignKey("QuestionId")]
    [InverseProperty("AnswerOption")]
    public virtual Question Question { get; set; }
}