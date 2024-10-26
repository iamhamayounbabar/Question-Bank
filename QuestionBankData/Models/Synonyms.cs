

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class Synonyms
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string WordId { get; set; }

    [Required]
    public string SynonymWordId { get; set; }

	[Required]
	public int Complexity { get; set; }

    [Required]
    public Guid Status { get; set; }

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

    [ForeignKey("Status")]
    [InverseProperty("Synonyms")]
    public virtual ReviewStatus StatusNavigation { get; set; }
}