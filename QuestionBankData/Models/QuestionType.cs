using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class QuestionType
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [InverseProperty("QuestionType")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();
}