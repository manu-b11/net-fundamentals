-- =============================================================
-- LoginApi — Esquema de Base de Datos (SQL Server)
-- Proyecto: LoginApi (.NET 9 minimal API de autenticación)
-- Motor:   SQL Server 2019+ / Azure SQL (T-SQL)
-- Re-ejecutable: crea solo lo que falte e idempotente
-- (incluye migración de columnas para bases ya existentes)
-- =============================================================
SET NOCOUNT ON;
GO

-- -----------------------------------------------------------
-- 1. BASE DE DATOS
-- -----------------------------------------------------------
IF DB_ID(N'LoginApiDB') IS NULL
BEGIN
    CREATE DATABASE LoginApiDB;
END
GO

USE LoginApiDB;
GO

-- -----------------------------------------------------------
-- 2. TABLAS
-- -----------------------------------------------------------

-- Usuarios del sistema (login + registro)
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        username      NVARCHAR(50)  NOT NULL,
        email         NVARCHAR(255) NULL,      -- opcional: se registra con o sin correo
        full_name     NVARCHAR(100) NULL,      -- nombre completo mostrado en la UI
        password_hash NVARCHAR(100) NOT NULL,  -- hash BCrypt (BCrypt.Net-Next)
        role          NVARCHAR(20)  NOT NULL CONSTRAINT DF_users_role     DEFAULT N'User',
        is_active     BIT           NOT NULL CONSTRAINT DF_users_is_active DEFAULT 1,
        last_login    DATETIME2(0)  NULL,
        created_at    DATETIME2(0)  NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME(),
        updated_at    DATETIME2(0)  NOT NULL CONSTRAINT DF_users_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_users_username UNIQUE (username),
        CONSTRAINT UQ_users_email    UNIQUE (email),
        CONSTRAINT CK_users_role     CHECK (role IN (N'Admin', N'User'))
    );
END
GO

-- Tokens de refresco (rotación de sesiones)
IF OBJECT_ID(N'dbo.refresh_tokens', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.refresh_tokens (
        id         INT IDENTITY(1,1) PRIMARY KEY,
        user_id    INT          NOT NULL,
        token_hash NVARCHAR(64) NOT NULL,       -- SHA-256 hex del token (nunca el token crudo)
        expires_at DATETIME2(0) NOT NULL,
        revoked_at DATETIME2(0) NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_rt_created_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_rt_token_hash UNIQUE (token_hash),
        CONSTRAINT FK_rt_user FOREIGN KEY (user_id)
            REFERENCES dbo.users(id) ON DELETE CASCADE
    );

    CREATE INDEX IX_rt_user    ON dbo.refresh_tokens(user_id);
    CREATE INDEX IX_rt_expires ON dbo.refresh_tokens(expires_at);
END
GO

-- -----------------------------------------------------------
-- 3. MIGRACIÓN DE BASES EXISTENTES (creadas con el esquema v1)
-- -----------------------------------------------------------

-- 3.1 Columna full_name
IF COL_LENGTH(N'dbo.users', N'full_name') IS NULL
BEGIN
    ALTER TABLE dbo.users ADD full_name NVARCHAR(100) NULL;
END
GO

-- 3.2 Email pasa a ser opcional (se quita NOT NULL y se recrea el UNIQUE)
IF EXISTS (SELECT 1 FROM sys.columns
           WHERE object_id = OBJECT_ID(N'dbo.users') AND name = N'email' AND is_nullable = 0)
BEGIN
    ALTER TABLE dbo.users DROP CONSTRAINT UQ_users_email;
    ALTER TABLE dbo.users ALTER COLUMN email NVARCHAR(255) NULL;
    ALTER TABLE dbo.users ADD CONSTRAINT UQ_users_email UNIQUE (email);
END
GO

-- -----------------------------------------------------------
-- 4. DATOS INICIALES (seeds, idempotente)
-- -----------------------------------------------------------

-- Usuario administrador por defecto
-- password: admin123  (¡cambiarlo en producción!)
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE username = N'admin')
BEGIN
    INSERT INTO dbo.users (username, email, full_name, password_hash, role)
    VALUES (N'admin', N'admin@login.local', N'Administrador',
            N'$2a$11$nw6FnVwDKv5OJDZa49ZImOq40wH5/1m.JiNHwcCVh/i6fEkq6TG2e',  -- admin123
            N'Admin');
END
GO

-- -----------------------------------------------------------
-- 5. VERIFICACIÓN
-- -----------------------------------------------------------
SELECT 'users'           AS objeto, COUNT(*) AS cantidad FROM dbo.users;
SELECT 'refresh_tokens'  AS objeto, COUNT(*) AS cantidad FROM dbo.refresh_tokens;
GO
