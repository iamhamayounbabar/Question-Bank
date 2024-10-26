

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

[Table("Subject_User")]
public partial class SubjectUser
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid SubjectId { get; set; }

    [Required]
    public string UserId { get; set; }

    [ForeignKey("SubjectId")]
    [InverseProperty("SubjectUser")]
    public virtual Subject Subject { get; set; }

    [NotMapped]
    public AspNetUser User { get; set; }
}