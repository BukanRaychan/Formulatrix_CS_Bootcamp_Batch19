# ASP.NET Wep API 8.0.421

A RESTful Web API built with ASP.NET Core following clean architecture principles. Built as part of Formulatrix CS Bootcamp Batch 19.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| ASP.NET Core 8 | Web API framework |
| Entity Framework Core | ORM |
| SQLite | Database |
| AutoMapper | Object mapping |
| FluentValidation | Request validation |
| ASP.NET Core Identity | User management |
| JWT Bearer | Authentication |
| Swagger / OpenAPI | API documentation |

---

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [dotnet-ef CLI tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

Install the EF CLI tool globally if you haven't already:

```bash
dotnet tool install --global dotnet-ef
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BukanRaychan/Formulatrix_CS_Bootcamp_Batch19.git
cd Formulatrix_CS_Bootcamp_Batch19
```

### 2. Restore dependencies

```bash
dotnet restore
```

### 3. Configure JWT settings

Open `appsettings.json` and set your JWT secret key:

```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "ProductCatalogAPI",
    "Audience": "ProductCatalogAPIUsers"
  }
}
```

> **Important:** Never commit your real JWT key to GitHub. Use environment variables or `appsettings.Development.json` for local development.

### 4. Apply migrations

```bash
dotnet ef database update
```

This creates the `ProductCatalog.db` SQLite file and applies all migrations.

### 5. Run the app

```bash
dotnet run
```

The app runs at `http://localhost:5280` by default.

### 6. Open Swagger UI

```
http://localhost:5280/swagger
```

---

## Project Structure

```
ProductCatalogAPI/
├── Controllers/    # HTTP endpoints, handles requests responses
│   └── ...
├── Data/   # Database context and seeding
│   └── ...
├── DTOs/   # Data Transfer Objects — controls API input/output shape
│   ├── AuthDtos/
│   │   └── ...
│   └── ProductDtos/
│       └── ...
├── Exceptions/   # Global error handling
│   └── ...
├── Migrations/           # EF Core auto-generated migration files
├── Models/               # Database entity classes
│   └── ...
├── Profiles/             # AutoMapper mapping profiles
│   └── ...
├── Repositories/         # Database query layer
│   └── ...
├── Services/             # Business logic layer
│   └── ...
├── Validators/           # FluentValidation rules
│   ├── AuthValidators/
│   │   └── ...
│   └── ProductValidators/
│       └── ...
├── appsettings.json
├── appsettings.Development.json
└── Program.cs
```

---

## Request Lifecycle

Every incoming request goes through these layers in order:

```
HTTP Request
    ↓
Global Exception Handler   (catches all unhandled errors)
    ↓
FluentValidation           (rejects invalid request body with 400)
    ↓
JWT Authentication         (rejects missing/invalid token with 401)
    ↓
Controller                 (receives DTO, returns HTTP response)
    ↓
Service                    (business logic, maps DTOs ↔ Models)
    ↓
Repository                 (database queries only)
    ↓
AppDbContext               (EF Core → SQLite)
    ↓
Database
```



## Authentication

This API uses **JWT Bearer** authentication.

### Step 1 — Register

```http
POST /api/Auth/register
Content-Type: application/json

{
  "firstName": "admin",
  "lastName": "utama",
  "email": "admin@example.com",
  "password": "password"
}
```

### Step 2 — Login

```http
POST /api/Auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@example.com",
    "firstName": "admin",
    "lastName": "utama",
    "expiresAt": "2026-06-08T06:00:00Z"
  }
}
```

### Step 3 — Use the token

Include the token in the `Authorization` header on all protected requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

In Swagger UI, click the **Authorize** button and enter:

```
Bearer your_token_here
```

---

## API Response Format

All responses follow a consistent wrapper format:

### Success

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": { ... },
  "error": null
}
```

### Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "data": null,
  "error": "Detailed error message"
}
```

---

## Database Seeding

The app automatically seeds sample product data on first run in the **Development** environment. Seeding is skipped if data already exists.

To reset and reseed from scratch:

```bash
dotnet ef database drop
dotnet ef database update
dotnet run
```

---

## Password Requirements

| Rule | Requirement |
|---|---|
| Minimum length | 6 characters |
| Requires digit | Yes |
| Requires uppercase | No |
| Requires non-alphanumeric | No |

---

## Environment Variables

| Key | Description |
|---|---|
| `Jwt:Key` | Secret key for signing JWT tokens (min 32 characters) |
| `Jwt:Issuer` | JWT issuer name |
| `Jwt:Audience` | JWT audience name |

---

## Development Notes

- The `.db` file is excluded from git via `.gitignore` — each developer has their own local database
- Migrations are committed to git so all developers share the same schema
- Swagger is only enabled in the `Development` environment
- Database seeding only runs in the `Development` environment
