using QuestionBankData.Models.Api_Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public enum QuestionStatus
{
    //For Questions
	New = 1,
	PendingReview = 2,
	PendingChanges = 3,
	Approved = 4,

    //For Answers
    PendingAnswerReview = 5,
    PendingAnswerChanges = 6,
    ApprovedAll = 7,
}

[Table("Question_Versions")]
public partial class QuestionVersions
{
    [Key]
    public Guid Id { get; set; }

    public int VersionNumber { get; set; }

    [Required]
    public Guid OrganizationId { get; set; }

    [Required]
    public Guid QuestionId { get; set; }

    public Guid? QuestionGroupId { get; set; }

    [Required]
    public string Question { get; set; }

    public string? Hint { get; set; }

	[Required]
	public int YearGroupId { get; set; }

	[Required]
	public int ComplexityId { get; set; }

	[Required]
	public int QuestionTypeId { get; set; }

    [Required]
    public Guid TopicId { get; set; }

	[Required]
	public int Score { get; set; }

    public string? Solution { get; set; }

    public string? VideoLink { get; set; }

    public string? QuestionReferences { get; set; }

    public string? MarkingScheme { get; set; }

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
    [StringLength(450)]
    public Guid Status { get; set; }

    [Required]
    public bool IsDraft { get; set; }

    public bool IsReady { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? ReadyDate { get; set; }

    [ForeignKey("ComplexityId")]
    [InverseProperty("QuestionVersions")]
    public virtual Complexity Complexity { get; set; }

    [ForeignKey("OrganizationId")]
    [InverseProperty("QuestionVersions")]
    public virtual Organization Organization { get; set; }

    [ForeignKey("QuestionGroupId")]
    [InverseProperty("QuestionVersions")]
    public virtual QuestionGroup? QuestionGroup { get; set; }

    [ForeignKey("QuestionId")]
    [InverseProperty("QuestionVersions")]
    public virtual Question QuestionNavigation { get; set; }

    [ForeignKey("QuestionTypeId")]
    [InverseProperty("QuestionVersions")]
    public virtual QuestionType QuestionType { get; set; }

    [ForeignKey("Status")]
    [InverseProperty("QuestionVersions")]
    public virtual ReviewStatus StatusNavigation { get; set; }

    [ForeignKey("TopicId")]
    [InverseProperty("QuestionVersions")]
    public virtual Topic Topic { get; set; }

    [ForeignKey("YearGroupId")]
    [InverseProperty("QuestionVersions")]
    public virtual YearGroup YearGroup { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }

    [NotMapped]
    public QuestionGroupVersions? QuestionGroupVersion { get; set; }

    [NotMapped]
    public List<AnswerOptionVersions> Answers { get; set; }

    [NotMapped]
    public List<TagRequest> Tags { get; set; }
}