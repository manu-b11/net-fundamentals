using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Falta Jwt:Key en la configuración.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "LoginApi";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "LoginApiFront";

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Falta ConnectionStrings:Default en la configuración.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

// ------------------------------------------------------------------
// Endpoints
// ------------------------------------------------------------------

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

// Registro de usuario (RF: crear cuenta)
app.MapPost("/api/auth/register", async (RegisterRequest req) =>
{
    var fullName = req.FullName?.Trim() ?? "";
    var username = req.Username?.Trim() ?? "";
    var password = req.Password ?? "";
    var email = string.IsNullOrWhiteSpace(req.Email) ? null : req.Email.Trim();

    if (fullName.Length == 0)
        return Results.BadRequest(new { message = "El nombre completo es obligatorio." });
    if (username.Length < 3 || username.Length > 50)
        return Results.BadRequest(new { message = "El usuario debe tener entre 3 y 50 caracteres." });
    if (password.Length < 8)
        return Results.BadRequest(new { message = "La contraseña debe tener al menos 8 caracteres." });
    if (email is not null && (email.Length > 255 || !email.Contains('@')))
        return Results.BadRequest(new { message = "El correo no es válido." });

    var hash = BCrypt.Net.BCrypt.EnhancedHashPassword(password, 11);

    try
    {
        await using var conn = new SqlConnection(connectionString);
        await conn.OpenAsync();

        const string sql = """
            INSERT INTO dbo.users (username, email, full_name, password_hash, role)
            VALUES (@username, @email, @fullName, @hash, N'User');
            SELECT CAST(SCOPE_IDENTITY() AS int);
            """;
        await using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@username", username);
        cmd.Parameters.AddWithValue("@email", (object?)email ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@fullName", fullName);
        cmd.Parameters.AddWithValue("@hash", hash);

        var id = (int)(await cmd.ExecuteScalarAsync())!;
        var user = new UserDto(id, username, fullName, email, "User");
        return Results.Created($"/api/auth/users/{id}", user);
    }
    catch (SqlException ex) when (ex.Number is 2601 or 2627)
    {
        return Results.Conflict(new { message = "El usuario o el correo ya están registrados." });
    }
});

// Login: valida credenciales y emite JWT
app.MapPost("/api/auth/login", async (LoginRequest req) =>
{
    var username = req.Username?.Trim() ?? "";
    var password = req.Password ?? "";

    if (username.Length == 0 || password.Length == 0)
        return Results.BadRequest(new { message = "Usuario y contraseña son obligatorios." });

    await using var conn = new SqlConnection(connectionString);
    await conn.OpenAsync();

    const string sql = """
        SELECT id, username, full_name, email, role, is_active, password_hash
        FROM dbo.users
        WHERE username = @username;
        """;
    await using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@username", username);

    await using var reader = await cmd.ExecuteReaderAsync();
    if (!await reader.ReadAsync())
        return Results.Json(new { message = "Usuario o contraseña incorrectos." }, statusCode: StatusCodes.Status401Unauthorized);

    var hash = reader.GetString(6);
    if (!BCrypt.Net.BCrypt.EnhancedVerify(password, hash))
        return Results.Json(new { message = "Usuario o contraseña incorrectos." }, statusCode: StatusCodes.Status401Unauthorized);

    if (!reader.GetBoolean(5))
        return Results.Json(new { message = "El usuario está inactivo." }, statusCode: StatusCodes.Status403Forbidden);

    var user = new UserDto(
        reader.GetInt32(0),
        reader.GetString(1),
        reader.IsDBNull(2) ? "" : reader.GetString(2),
        reader.IsDBNull(3) ? null : reader.GetString(3),
        reader.GetString(4));

    await reader.CloseAsync();

    // Registrar último ingreso
    await using var upd = new SqlCommand(
        "UPDATE dbo.users SET last_login = SYSUTCDATETIME() WHERE id = @id;", conn);
    upd.Parameters.AddWithValue("@id", user.Id);
    await upd.ExecuteNonQueryAsync();

    var (token, expiresAt) = CrearToken(user);
    return Results.Ok(new AuthResponse(token, expiresAt, user));
});

// Devuelve el usuario autenticado por el Bearer token (validación del JWT)
app.MapGet("/api/auth/me", (ClaimsPrincipal principal) =>
{
    var id = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
    var username = principal.FindFirstValue(ClaimTypes.Name) ?? principal.Identity?.Name ?? "";
    var fullName = principal.FindFirstValue("full_name") ?? username;
    var role = principal.FindFirstValue(ClaimTypes.Role) ?? "User";
    return Results.Ok(new UserDto(int.Parse(id ?? "0"), username, fullName, null, role));
}).RequireAuthorization();

app.Run();

// ------------------------------------------------------------------
// Helpers y contratos
// ------------------------------------------------------------------

(string Token, DateTime ExpiresAt) CrearToken(UserDto user, int hours = 8)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim("full_name", user.FullName),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var expiresAt = DateTime.UtcNow.AddHours(hours);
    var token = new JwtSecurityToken(
        issuer: jwtIssuer,
        audience: jwtAudience,
        claims: claims,
        expires: expiresAt,
        signingCredentials: credentials);

    return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
}

record RegisterRequest(string FullName, string Username, string Password, string? Email = null);
record LoginRequest(string Username, string Password);
record UserDto(int Id, string Username, string FullName, string? Email, string Role);
record AuthResponse(string Token, DateTime ExpiresAt, UserDto User);
