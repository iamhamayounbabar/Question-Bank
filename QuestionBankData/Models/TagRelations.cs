

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

[Table("Tag_Relations")]
public partial class TagRelations
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string RelationId { get; set; }

    [Required]
    public Guid TagId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [ForeignKey("TagId")]
    [InverseProperty("TagRelations")]
    public virtual Tag Tag { get; set; }
}