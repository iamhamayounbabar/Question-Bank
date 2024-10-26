using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class Organization
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }

	[Required]
	public string Logo { get; set; }

	[Required]
	public string Website { get; set; }

	[Required]
	public string CopyRight { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateModified { get; set; }

    public string? ModifiedBy { get; set; }

    [InverseProperty("Organization")]
    public virtual ICollection<PaperVersions> PaperVersions { get; } = new List<PaperVersions>();

    [InverseProperty("Organization")]
    public virtual ICollection<QuestionGroupVersions> QuestionGroupVersions { get; } = new List<QuestionGroupVersions>();

    [InverseProperty("Organization")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();
}