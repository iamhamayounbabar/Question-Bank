using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class Paper
{
    [Key]
    public Guid Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [Required]
    public bool IsPublished { get; set; }

    [InverseProperty("Paper")]
    public virtual ICollection<PaperVersions> PaperVersions { get; } = new List<PaperVersions>();
}