

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class ReviewStatus
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; }

    [InverseProperty("StatusNavigation")]
    public virtual PaperVersions PaperVersions { get; set; }

    [InverseProperty("StatusNavigation")]
    public virtual ICollection<QuestionVersions> QuestionVersions { get; } = new List<QuestionVersions>();

    [InverseProperty("StatusNavigation")]
    public virtual ICollection<Synonyms> Synonyms { get; } = new List<Synonyms>();
}