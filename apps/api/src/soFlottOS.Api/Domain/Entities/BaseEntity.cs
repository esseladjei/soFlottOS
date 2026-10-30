namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// Base class for every database entity. It gives each table an integer primary key
/// and automatic created/updated timestamps (filled in by AppDbContext.SaveChanges).
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
