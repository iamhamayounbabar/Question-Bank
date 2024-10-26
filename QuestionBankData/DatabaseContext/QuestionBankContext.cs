using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuestionBankData.Models;

namespace QuestionBankData.DatabaseContext;

public partial class QuestionBankContext : IdentityDbContext<AspNetUser>
{
    public QuestionBankContext(DbContextOptions<QuestionBankContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AnswerOption> AnswerOption { get; set; }

    public virtual DbSet<AnswerOptionVersions> AnswerOptionVersions { get; set; }

    public virtual DbSet<Complexity> Complexity { get; set; }

    public virtual DbSet<KeyStage> KeyStage { get; set; }

    public virtual DbSet<Organization> Organization { get; set; }

    public virtual DbSet<Paper> Paper { get; set; }

    public virtual DbSet<PaperType> PaperType { get; set; }

    public virtual DbSet<PaperVersions> PaperVersions { get; set; }

    public virtual DbSet<Question> Question { get; set; }

    public virtual DbSet<QuestionGroup> QuestionGroup { get; set; }

    public virtual DbSet<QuestionGroupVersions> QuestionGroupVersions { get; set; }

    public virtual DbSet<QuestionType> QuestionType { get; set; }

    public virtual DbSet<QuestionVersions> QuestionVersions { get; set; }

    public virtual DbSet<ReviewComment> ReviewComment { get; set; }

    public virtual DbSet<ReviewStatus> ReviewStatus { get; set; }

    public virtual DbSet<Subject> Subject { get; set; }

    public virtual DbSet<SubjectUser> SubjectUser { get; set; }

    public virtual DbSet<Synonyms> Synonyms { get; set; }

    public virtual DbSet<Tag> Tag { get; set; }

    public virtual DbSet<TagRelations> TagRelations { get; set; }

    public virtual DbSet<Topic> Topic { get; set; }

    public virtual DbSet<YearGroup> YearGroup { get; set; }

    //protected override void OnModelCreating(ModelBuilder modelBuilder)
    //{
    //    modelBuilder.UseCollation("Latin1_General_CI_AS");

    //    modelBuilder.Entity<AnswerOption>(entity =>
    //    {
    //        entity.HasOne(d => d.Question).WithMany(p => p.AnswerOption)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_AnswerOption_Question");
    //    });

    //    modelBuilder.Entity<AnswerOptionVersions>(entity =>
    //    {
    //        entity.Property(e => e.VersionNumber).ValueGeneratedOnAdd();

    //        entity.HasOne(d => d.AnswerOption).WithMany(p => p.AnswerOptionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_AnswerOption_Versions_AnswerOption");
    //    });

    //    modelBuilder.Entity<Paper>(entity =>
    //    {
    //        entity.HasKey(e => e.Id).HasName("PK_Assignment");

    //        entity.Property(e => e.IsPublished).HasDefaultValueSql("((1))");
    //    });

    //    modelBuilder.Entity<PaperVersions>(entity =>
    //    {
    //        entity.HasKey(e => e.Id).HasName("PK_Assignment_Versions");

    //        entity.Property(e => e.IsDraft).HasDefaultValueSql("((1))");
    //        entity.Property(e => e.VersionNumber).ValueGeneratedOnAdd();

    //        entity.HasOne(d => d.IdNavigation).WithOne(p => p.PaperVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Assignment_Versions_ReviewStatus");

    //        entity.HasOne(d => d.Organization).WithMany(p => p.PaperVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Assignment_Versions_Organization");

    //        entity.HasOne(d => d.Paper).WithMany(p => p.PaperVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Assignment_Versions_Assignment");

    //        entity.HasOne(d => d.PaperType).WithMany(p => p.PaperVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Paper_Versions_PaperType");

    //        entity.HasOne(d => d.YearGroup).WithMany(p => p.PaperVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Assignment_Versions_YearGroup");
    //    });

    //    modelBuilder.Entity<Question>(entity =>
    //    {
    //        entity.Property(e => e.IsPublished).HasDefaultValueSql("((1))");
    //    });

    //    modelBuilder.Entity<QuestionGroupVersions>(entity =>
    //    {
    //        entity.Property(e => e.VersionNumber).ValueGeneratedOnAdd();

    //        entity.HasOne(d => d.Organization).WithMany(p => p.QuestionGroupVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_QuestionGroup_Versions_Organization");

    //        entity.HasOne(d => d.QuestionGroup).WithMany(p => p.QuestionGroupVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_QuestionGroup_Versions_QuestionGroup");
    //    });

    //    modelBuilder.Entity<QuestionVersions>(entity =>
    //    {
    //        entity.Property(e => e.IsDraft).HasDefaultValueSql("((1))");
    //        entity.Property(e => e.VersionNumber).ValueGeneratedOnAdd();

    //        entity.HasOne(d => d.Complexity).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_Complexity");

    //        entity.HasOne(d => d.Organization).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_Organization");

    //        entity.HasOne(d => d.QuestionGroup).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_QuestionGroup");

    //        entity.HasOne(d => d.QuestionNavigation).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_Question");

    //        entity.HasOne(d => d.QuestionType).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_QuestionType");

    //        entity.HasOne(d => d.StatusNavigation).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_ReviewStatus");

    //        entity.HasOne(d => d.Topic).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_Topic");

    //        entity.HasOne(d => d.YearGroup).WithMany(p => p.QuestionVersions)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Question_Versions_YearGroup");
    //    });

    //    modelBuilder.Entity<SubjectUser>(entity =>
    //    {
    //        entity.HasOne(d => d.Subject).WithMany(p => p.SubjectUser)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Subject_User_Subject");
    //    });

    //    modelBuilder.Entity<Synonyms>(entity =>
    //    {
    //        entity.HasOne(d => d.StatusNavigation).WithMany(p => p.Synonyms)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Synonyms_ReviewStatus");
    //    });

    //    modelBuilder.Entity<TagRelations>(entity =>
    //    {
    //        entity.HasOne(d => d.Tag).WithMany(p => p.TagRelations)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Tag_Relations_Tag");
    //    });

    //    modelBuilder.Entity<Topic>(entity =>
    //    {
    //        entity.HasOne(d => d.ParentTopicNavigation).WithMany(p => p.InverseParentTopicNavigation).HasConstraintName("FK_Topic_Topic");

    //        entity.HasOne(d => d.Subject).WithMany(p => p.Topic)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_Topic_Subject");
    //    });

    //    modelBuilder.Entity<YearGroup>(entity =>
    //    {
    //        entity.HasOne(d => d.KeyStage).WithMany(p => p.YearGroup)
    //            .OnDelete(DeleteBehavior.Cascade)
    //            .HasConstraintName("FK_YearGroup_KeyStage");
    //    });

    //    base.OnModelCreating(modelBuilder);
    //}
}