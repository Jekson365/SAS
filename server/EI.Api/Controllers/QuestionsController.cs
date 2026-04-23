using Microsoft.AspNetCore.Mvc;

namespace EI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions =
        new(StringComparer.OrdinalIgnoreCase) { ".png", ".jpg", ".jpeg", ".gif", ".webp" };

    private const long MaxBytes = 5 * 1024 * 1024;

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "ფაილი არ არის ატვირთული." });

        if (file.Length > MaxBytes)
            return BadRequest(new { message = "ფაილი ძალიან დიდია (მაქს. 5MB)." });

        var ext = Path.GetExtension(file.FileName);
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { message = "დაშვებული ფორმატები: png, jpg, jpeg, gif, webp." });

        var folder = Path.Combine(env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot"), "question_images");
        Directory.CreateDirectory(folder);

        var fileName = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var fullPath = Path.Combine(folder, fileName);

        await using (var stream = System.IO.File.Create(fullPath))
            await file.CopyToAsync(stream);

        var url = $"/question_images/{fileName}";
        return Ok(new { url });
    }
}
