using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

[Table("AnswerOption_Versions")]
public partial class AnswerOptionVersions
{
    [Key]
    public Guid Id { get; set; }

    public int VersionNumber { get; set; }

    [Required]
    public Guid AnswerOptionId { get; set; }

    public bool IsCorrectAnswer { get; set; }

    [Required]
    public string Answer { get; set; }

    [Required]
    public string AnswerCode { get; set; }

    [Required]
    public string CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ReviewedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "datetime")]
    public DateTime? DateModified { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateReviewed { get; set; }

    [ForeignKey("AnswerOptionId")]
    [InverseProperty("AnswerOptionVersions")]
    public virtual AnswerOption AnswerOption { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }
}