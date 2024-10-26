using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuestionBankData.Models.Api_Models
{
    #nullable enable
    public class AddPaperRequest
    {
        public string? Header { get; set; }
        public string? Footer { get; set; }
        public Guid Organization { get; set; }
        public Guid Paper { get; set; }
        public int PaperType { get; set; }
        public int YearGroup { get; set; }
        public string Name { get; set; }
        public string TimeAllowed { get; set; }
    }
}
