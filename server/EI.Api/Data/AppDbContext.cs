using EI.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EI.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Test> Tests => Set<Test>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<TestResult> TestResults => Set<TestResult>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<TestRegistration> TestRegistrations => Set<TestRegistration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Subject>(e =>
        {
            e.ToTable("subjects");
            e.Property(s => s.Id).HasColumnName("id");
            e.Property(s => s.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<Event>(e =>
        {
            e.ToTable("events");
            e.Property(ev => ev.Id).HasColumnName("id");
            e.Property(ev => ev.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
            e.Property(ev => ev.Description).HasColumnName("description").HasDefaultValue("").IsRequired();
            e.Property(ev => ev.EventDate).HasColumnName("event_date");
        });

        modelBuilder.Entity<Test>(e =>
        {
            e.ToTable("tests");
            e.Property(t => t.Id).HasColumnName("id");
            e.Property(t => t.SubjectId).HasColumnName("subject_id");
            e.Property(t => t.Title).HasColumnName("title").HasMaxLength(200).HasDefaultValue("").IsRequired();
            e.Property(t => t.EventId).HasColumnName("event_id");
            e.Property(t => t.Etapi).HasColumnName("etapi").HasMaxLength(50).IsRequired();
            e.Property(t => t.TestStartDate).HasColumnName("test_start_date");
            e.Property(t => t.MaxScore).HasColumnName("max_score");
            e.Property(t => t.PassScore).HasColumnName("pass_score");
            e.Property(t => t.FinalScore).HasColumnName("final_score");
            e.Property(t => t.Succeed).HasColumnName("succeed");
            e.Property(t => t.OnGoing).HasColumnName("on_going").HasDefaultValue(false).IsRequired();
            e.Property(t => t.DurationMinutes).HasColumnName("duration_minutes").HasDefaultValue(0).IsRequired();
            e.Property(t => t.StartedAt).HasColumnName("started_at");

            e.HasOne(t => t.Subject)
             .WithMany()
             .HasForeignKey(t => t.SubjectId);

            e.HasOne(t => t.Event)
             .WithMany(ev => ev.Tests)
             .HasForeignKey(t => t.EventId)
             .OnDelete(DeleteBehavior.SetNull);
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
            e.Property(r => r.DurationSeconds).HasColumnName("duration_seconds").HasDefaultValue(0).IsRequired();
            e.Property(r => r.Answers).HasColumnName("answers").HasColumnType("jsonb").HasDefaultValueSql("'[]'::jsonb").IsRequired();

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
            e.Property(q => q.Point).HasColumnName("point").HasDefaultValue(1).IsRequired();
            e.Property(q => q.Type).HasColumnName("type").HasMaxLength(20).HasDefaultValue("quiz").IsRequired();
            e.Property(q => q.ImageUrl).HasColumnName("image_url");
            e.Property(q => q.CorrectAnswer).HasColumnName("correct_answer");

            e.HasOne(q => q.Test)
             .WithMany()
             .HasForeignKey(q => q.TestId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TestRegistration>(e =>
        {
            e.ToTable("test_registrations");
            e.Property(r => r.Id).HasColumnName("id");
            e.Property(r => r.UserId).HasColumnName("user_id");
            e.Property(r => r.TestId).HasColumnName("test_id");
            e.Property(r => r.RegistrationDate).HasColumnName("registration_date");
            e.Property(r => r.IsPaid).HasColumnName("is_paid").HasDefaultValue(false).IsRequired();

            e.HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.Test).WithMany().HasForeignKey(r => r.TestId).OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(r => new { r.UserId, r.TestId }).IsUnique();
        });
    }
}
