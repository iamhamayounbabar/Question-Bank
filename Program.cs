using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using QuestionBank.Interfaces;
using QuestionBank.Services;
using QuestionBankData.DatabaseContext;
using QuestionBankData.Models;
using QuestionBankData.Models.Api_Models;
using Serviceheroe.Utility;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
	options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

//builder.Services.AddDbContext<QuestionBankContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("default")));
builder.Services.AddDbContext<QuestionBankContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("local")));

builder.Services.AddIdentity<AspNetUser, IdentityRole>()
				.AddEntityFrameworkStores<QuestionBankContext>()
				.AddDefaultTokenProviders();

builder.Services.AddSignalR(e => {
	e.MaximumReceiveMessageSize = 99999999999;
});

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.SaveToken = true;
	options.RequireHttpsMetadata = true;
	options.TokenValidationParameters = new TokenValidationParameters()
	{
		ValidateIssuer = false,
		ValidateAudience = false,
		ValidateIssuerSigningKey = true,
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"])),
		ValidateLifetime = true
	};
	options.Events = new JwtBearerEvents
	{
		OnMessageReceived = context =>
		{
			var accessToken = context.Request.Query["access_token"];

			var path = context.HttpContext.Request.Path;
			if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/CentralHub"))
			{
				context.Token = accessToken;
			}
			return Task.CompletedTask;
		}
	};
});

builder.Services.Configure<IdentityOptions>(options =>
{
	options.Password.RequiredLength = 8;
	options.Password.RequireNonAlphanumeric = false;
	options.User.RequireUniqueEmail = true;
});

builder.Services.AddSpaStaticFiles(configuration =>
{
	configuration.RootPath = "ClientApp/build";
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddSingleton<IQuestionService, QuestionService>();
builder.Services.AddSingleton<ISubjectService, SubjectService>();
builder.Services.AddSingleton<ITopicService, TopicService>();
builder.Services.AddSingleton<IOrganizationService, OrganizationService>();
builder.Services.AddSingleton<IQuestionTypeService, QuestionTypeService>();
builder.Services.AddSingleton<IComplexityService, ComplexityService>();
builder.Services.AddSingleton<IAnswerService, AnswerService>();
builder.Services.AddSingleton<IQuestionGroupService, QuestionGroupService>();
builder.Services.AddSingleton<ITagService, TagService>();
builder.Services.AddSingleton<IPaperTypeService, PaperTypeService>();
builder.Services.AddSingleton<IPaperService, PaperService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
	var factory = app.Services.GetRequiredService<IServiceScopeFactory>();
	using var scopeF = factory.CreateScope();
	var userManager = scopeF.ServiceProvider.GetRequiredService<UserManager<AspNetUser>>();
	var roleManager = scopeF.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
	var context = scopeF.ServiceProvider.GetRequiredService<QuestionBankContext>();
	SeedAdmin.SeedData(userManager, roleManager, context);
}

#pragma warning disable ASP0014 // Suggest using top level route registrations
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action}/{id?}");
});
#pragma warning restore ASP0014 // Suggest using top level route registrations

app.UseSpa(spa =>
{
	spa.Options.SourcePath = "ClientApp";
	
	if (app.Environment.IsDevelopment())
	{
		spa.UseReactDevelopmentServer(npmScript: "start");
	}
});

app.Run();