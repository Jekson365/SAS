using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<TestResult> TestResults => Set<TestResult>();
    public DbSet<Question> Questions => Set<Question>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Subject>(e =>
        {
            e.ToTable("subjects");
            e.Property(s => s.Id).HasColumnName("id");
            e.Property(s => s.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<Test>(e =>
        {
            e.ToTable("tests");
            e.Property(t => t.Id).HasColumnName("id");
            e.Property(t => t.SubjectId).HasColumnName("subject_id");
            e.Property(t => t.Etapi).HasColumnName("etapi").HasMaxLength(50).IsRequired();
            e.Property(t => t.TestTakenDate).HasColumnName("test_taken_date");
            e.Property(t => t.MaxScore).HasColumnName("max_score");
            e.Property(t => t.PassScore).HasColumnName("pass_score");
            e.Property(t => t.FinalScore).HasColumnName("final_score");
            e.Property(t => t.Succeed).HasColumnName("succeed");

            e.HasOne(t => t.Subject)
             .WithMany()
             .HasForeignKey(t => t.SubjectId);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.Property(u => u.Id).HasColumnName("id");
            e.Property(u => u.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
            e.Property(u => u.Surname).HasColumnName("surname").HasMaxLength(100).IsRequired();
            e.Property(u => u.PrivateNumber).HasColumnName("private_number").IsRequired();
            e.Property(u => u.MobileNumber).HasColumnName("mobile_number").HasMaxLength(128).IsRequired();
            e.Property(u => u.Email).HasColumnName("email").IsRequired();
            e.Property(u => u.Password).HasColumnName("password").IsRequired();
            e.Property(u => u.Role).HasColumnName("role").HasConversion<int>().HasDefaultValue(UserRole.User).IsRequired();
            e.Property(u => u.IsVerified).HasColumnName("is_verified").HasDefaultValue(false).IsRequired();
            e.Property(u => u.VerificationCode).HasColumnName("verification_code").HasMaxLength(10);
            e.Property(u => u.VerificationExpiresAt).HasColumnName("verification_expires_at");

            e.HasIndex(u => u.PrivateNumber).IsUnique();
            e.HasIndex(u => u.MobileNumber).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Session>(e =>
        {
            e.ToTable("sessions");
            e.Property(s => s.Id).HasColumnName("id");
            e.Property(s => s.UserId).HasColumnName("user_id");
            e.Property(s => s.Token).HasColumnName("token").IsRequired();
            e.Property(s => s.CreatedAt).HasColumnName("created_at");
            e.Property(s => s.ExpiresAt).HasColumnName("expires_at");

            e.HasOne(s => s.User)
             .WithMany()
             .HasForeignKey(s => s.UserId);

            e.HasIndex(s => s.Token).IsUnique();
        });

        modelBuilder.Entity<TestResult>(e =>
        {
            e.ToTable("test_results");
            e.Property(r => r.Id).HasColumnName("id");
            e.Property(r => r.UserId).HasColumnName("user_id");
            e.Property(r => r.TestId).HasColumnName("test_id");
            e.Property(r => r.Score).HasColumnName("score");
            e.Property(r => r.Passed).HasColumnName("passed");
            e.Property(r => r.SubmittedAt).HasColumnName("submitted_at");

            e.HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId);
            e.HasOne(r => r.Test).WithMany().HasForeignKey(r => r.TestId);
        });

        modelBuilder.Entity<Question>(e =>
        {
            e.ToTable("questions");
            e.Property(q => q.Id).HasColumnName("id");
            e.Property(q => q.TestId).HasColumnName("test_id");
            e.Property(q => q.QuestionText).HasColumnName("question_text").IsRequired();
            e.Property(q => q.Options).HasColumnName("options").HasColumnType("jsonb");
            e.Property(q => q.CorrectIndex).HasColumnName("correct_index");

            e.HasOne(q => q.Test)
             .WithMany()
             .HasForeignKey(q => q.TestId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
