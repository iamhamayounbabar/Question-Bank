

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class Tag
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [Column("Tag")]
    public string Tag1 { get; set; }

    [Required]
    public string CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "datetime")]
    public DateTime? DateModified { get; set; }

    [InverseProperty("Tag")]
    public virtual ICollection<TagRelations> TagRelations { get; } = new List<TagRelations>();
}