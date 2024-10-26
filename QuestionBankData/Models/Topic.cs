

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

#nullable enable
public partial class Topic
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid SubjectId { get; set; }

	[Required]
	public string Name { get; set; }

    public Guid? ParentTopic { get; set; }

    [Required]
    public string CreatedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    [InverseProperty("ParentTopicNavigation")]
    public virtual ICollection<Topic> InverseParentTopicNavigation { get; } = new List<Topic>();

    [ForeignKey("ParentTopic")]
    [InverseProperty("InverseParentTopicNavigation")]
    public virtual Topic? ParentTopicNavigation { get; set; }

    [InverseProperty("Topic")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();

    [ForeignKey("SubjectId")]
    [InverseProperty("Topic")]
    public virtual Subject Subject { get; set; }
}