using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuestionBankData.Models.Api_Models
{
    public class AddAnswersRequest
    {
        public bool IsCorrect { get; set; }
        public string Ans { get; set; }
        public string AnsCode { get; set; }

        public Guid? AnsId { get; set; }
    }
}
