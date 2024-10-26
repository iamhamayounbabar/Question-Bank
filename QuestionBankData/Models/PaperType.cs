using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class PaperType
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [InverseProperty("PaperType")]
    public virtual ICollection<PaperVersions> PaperVersions { get; } = new List<PaperVersions>();
}