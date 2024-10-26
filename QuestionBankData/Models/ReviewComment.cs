

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class ReviewComment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string RelatedTo { get; set; }

    [Required]
    public string Comment { get; set; }

    public bool IsRead { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Required]
    public string CreatedBy { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }
}