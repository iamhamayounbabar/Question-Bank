using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

[Table("Paper_Versions")]
public partial class PaperVersions
{
    [Key]
    public Guid Id { get; set; }

    public int VersionNumber { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    public string? Header { get; set; }

    public string? Footer { get; set; }

    [Required]
    public Guid PaperId { get; set; }

	[Required]
	public int PaperTypeId { get; set; }

	[Required]
	public int YearGroupId { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string TimeAllowed { get; set; }

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

    [Required]
    public Guid Status { get; set; }

    [Required]
    public bool IsDraft { get; set; }

    [ForeignKey("Status")]
    [InverseProperty("PaperVersions")]
    public virtual ReviewStatus StatusNavigation { get; set; }

    [ForeignKey("OrganizationId")]
    [InverseProperty("PaperVersions")]
    public virtual Organization Organization { get; set; }

    [ForeignKey("PaperId")]
    [InverseProperty("PaperVersions")]
    public virtual Paper Paper { get; set; }

    [ForeignKey("PaperTypeId")]
    [InverseProperty("PaperVersions")]
    public virtual PaperType PaperType { get; set; }

    [ForeignKey("YearGroupId")]
    [InverseProperty("PaperVersions")]
    public virtual YearGroup YearGroup { get; set; }

    [NotMapped]
    public PaperVersions? PaperVersion { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }
}