

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace QuestionBankData.Models;

public partial class Subject
{
    [Key]
    public Guid Id { get; set; }

    public string? Colour { get; set; }

	[Required]
	public string Name { get; set; }

    [Required]
    public string CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "datetime")]
    public DateTime? DateModified { get; set; }

	[InverseProperty("Subject")]
    public virtual ICollection<SubjectUser> SubjectUser { get; } = new List<SubjectUser>();

    [InverseProperty("Subject")]
    public virtual ICollection<Topic> Topic { get; } = new List<Topic>();
}