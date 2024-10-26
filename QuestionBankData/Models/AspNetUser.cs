using Microsoft.AspNetCore.Identity;

namespace QuestionBankData.Models
{
	public static class Roles
	{
		public static string Admin = "Admin";
		public static string ContentCreator = "Content Creator";
		public static string Approver = "Approver";
		public static string Testcreator = "Test Creator";
	}
	public class AspNetUser : IdentityUser
    {
        public string Name { get; set; }
        public DateTime LastAccessTime { get; set; } = DateTime.UtcNow;
        public string Role { get; set; }
	}
}
