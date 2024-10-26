using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class QuestionGroup
{
    [Key]
    public Guid Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [InverseProperty("QuestionGroup")]
    public virtual ICollection<QuestionGroupVersions> QuestionGroupVersions { get; } = new List<QuestionGroupVersions>();

    [InverseProperty("QuestionGroup")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();
}