

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class YearGroup
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

	[Required]
	public int KeyStageId { get; set; }

    [ForeignKey("KeyStageId")]
    [InverseProperty("YearGroup")]
    public virtual KeyStage KeyStage { get; set; }

    [InverseProperty("YearGroup")]
    public virtual ICollection<PaperVersions> PaperVersions { get; } = new List<PaperVersions>();

    [InverseProperty("YearGroup")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();
}