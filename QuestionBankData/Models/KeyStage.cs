using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuestionBankData.Models;

public partial class KeyStage
{
    [Key]
	public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [InverseProperty("KeyStage")]
    public virtual ICollection<YearGroup> YearGroup { get; } = new List<YearGroup>();
}