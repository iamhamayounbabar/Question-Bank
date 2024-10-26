using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

[Table("QuestionGroup_Versions")]
public partial class QuestionGroupVersions
{
    [Key]
    public Guid Id { get; set; }

    public int VersionNumber { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Guid QuestionGroupId { get; set; }

    [Required]
    public string Title { get; set; }

    public string? Body { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

	[Required]
    public string CreatedBy { get; set; }

    [StringLength(450)]
    public string? ModifiedBy { get; set; }

    public string? ReviewedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateModified { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? DateReviewed { get; set; }

    [ForeignKey("OrganizationId")]
    [InverseProperty("QuestionGroupVersions")]
    public virtual Organization Organization { get; set; }

    [ForeignKey("QuestionGroupId")]
    [InverseProperty("QuestionGroupVersions")]
    public virtual QuestionGroup QuestionGroup { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }
}