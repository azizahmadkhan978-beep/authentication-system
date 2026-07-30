# Authentication System

A backend authentication and Role-Based Access Control system built with Node.js, Express, PostgreSQL, Docker, JWT, and Postman.

The project contains two independent services:

1. **Auth Service** — handles registration, login, password hashing, and JWT generation.
2. **Resource Service** — handles protected resource CRUD operations and enforces role permissions.

---

## Architecture

### Auth Service

The Auth Service runs on port `3001`.

Responsibilities:

- Register users
- Validate login credentials
- Hash passwords using bcrypt
- Read user roles from PostgreSQL
- Generate JWT access tokens containing the user ID and role

Endpoints:

```text
GET  /health
POST /register
POST /login
```

### Resource Service

The Resource Service runs on port `3002`.

Responsibilities:

- Validate JWT access tokens
- Extract the user ID and role from the token
- Check permissions stored in PostgreSQL
- Perform protected resource CRUD operations
- Return `401` for authentication failures
- Return `403` when the user lacks permission

Endpoints:

```text
GET    /health
POST   /resource
GET    /resource
PUT    /resource/:id
DELETE /resource/:id
```

---

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- Docker
- Docker Compose
- JSON Web Token
- bcryptjs
- pg
- dotenv
- Helmet
- CORS
- Nodemon
- Postman

---

## Project Structure

```text
authentication-system/
├── auth-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── resource-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── database/
|    ├── init.sql
|    └── seed.sql
├── postman/
│   ├── Authentication-System.postman_collection.json
│   └── Authentication-System-Local.postman_environment.json
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

## Roles and Permissions

The system defines three roles and four permissions.

| Role | Create | Read | Update | Delete |
|---|---:|---:|---:|---:|
| Admin | Yes | Yes | Yes | Yes |
| Editor | Yes | Yes | Yes | No |
| Viewer | No | Yes | No | No |

Roles, permissions, and role-permission mappings are stored in PostgreSQL.

---

## Database Initialization

PostgreSQL runs through Docker Compose.

The database setup uses two SQL files:

- `database/init.sql` creates the required tables, constraints, and relationships.
- `database/seed.sql` inserts the required roles, permissions, role-permission mappings, and demonstration users.

The initialization order is:

```text
1. init.sql
2. seed.sql
```

The seed data includes:

- `admin`, `editor`, and `viewer` roles;
- `create`, `read`, `update`, and `delete` permissions;
- role-permission mappings;
- one user for each role.

The SQL files run automatically when PostgreSQL starts with a new database volume.

To reset the database and rerun both files:

```bash
docker compose down -v
docker compose up -d
```

> Warning: `docker compose down -v` deletes the existing PostgreSQL data volume.
---

## Seeded Users

The `database/seed.sql` file inserts one demonstration user for each role.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Admin123!` |
| Editor | `editor@example.com` | `Editor123!` |
| Viewer | `viewer@example.com` | `Viewer123!` |

These accounts are intended for local development and demonstration.

---

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Docker Desktop
- Git
- Postman or the Postman VS Code extension

---

## Environment Variables

Create a `.env` file inside each service using its `.env.example` file.

### Auth Service

Create `auth-service/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/authentication_system
JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=1h
JWT_ISSUER=auth-service
JWT_AUDIENCE=resource-service
```

### Resource Service

Create `resource-service/.env`:

```env
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/authentication_system
JWT_SECRET=replace_with_the_same_secret_used_by_auth_service
JWT_ISSUER=auth-service
JWT_AUDIENCE=resource-service
```

The `JWT_SECRET` must be exactly the same in both services.

Real `.env` files must not be committed to Git.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd authentication-system
```

Install the Auth Service dependencies:

```bash
cd auth-service
npm install
```

Install the Resource Service dependencies:

```bash
cd ../resource-service
npm install
```

Return to the project root:

```bash
cd ..
```

---

## Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Check that PostgreSQL is running:

```bash
docker ps
```

When PostgreSQL starts with a new volume:

1. `database/init.sql` creates the schema.
2. `database/seed.sql` inserts roles, permissions, mappings, and demonstration users.

To reset the database and rerun the initialization SQL:

```bash
docker compose down -v
docker compose up -d
```

> Warning: `docker compose down -v` deletes the existing PostgreSQL data volume.

---

## Run the Services

Open one terminal for the Auth Service:

```bash
cd auth-service
npm run dev
```

The Auth Service runs at:

```text
http://localhost:3001
```

Open another terminal for the Resource Service:

```bash
cd resource-service
npm run dev
```

The Resource Service runs at:

```text
http://localhost:3002
```

---

## Health Checks

### Auth Service

```http
GET http://localhost:3001/health
```

Expected response:

```text
200 OK
```

### Resource Service

```http
GET http://localhost:3002/health
```

Expected response:

```text
200 OK
```

---

## API Endpoints

### Register User

```http
POST http://localhost:3001/register
Content-Type: application/json
```

Example request:

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Password123!"
}
```

A newly registered user receives the default `viewer` role.

Expected successful response:

```text
201 Created
```

Duplicate email:

```text
409 Conflict
```

### Login

```http
POST http://localhost:3001/login
Content-Type: application/json
```

Example request:

```json
{
  "email": "viewer@example.com",
  "password": "Viewer123!"
}
```

Expected successful response:

```text
200 OK
```

The response contains a JWT access token:

```json
{
  "accessToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": "1h",
  "user": {
    "id": 3,
    "email": "viewer@example.com",
    "role": "viewer"
  }
}
```

### Create Resource

```http
POST http://localhost:3002/resource
Authorization: Bearer <access-token>
Content-Type: application/json
```

Example body:

```json
{
  "title": "Prepare Documentation",
  "description": "Document the authentication and RBAC flow."
}
```

Required permission:

```text
create
```

Expected results:

```text
Admin  → 201 Created
Editor → 201 Created
Viewer → 403 Forbidden
```

### Read Resources

```http
GET http://localhost:3002/resource
Authorization: Bearer <access-token>
```

Required permission:

```text
read
```

Expected results:

```text
Admin  → 200 OK
Editor → 200 OK
Viewer → 200 OK
```

### Update Resource

```http
PUT http://localhost:3002/resource/:id
Authorization: Bearer <access-token>
Content-Type: application/json
```

Example body:

```json
{
  "title": "Updated Documentation",
  "description": "Add API examples and Postman results."
}
```

Required permission:

```text
update
```

Expected results:

```text
Admin  → 200 OK
Editor → 200 OK
Viewer → 403 Forbidden
```

### Delete Resource

```http
DELETE http://localhost:3002/resource/:id
Authorization: Bearer <access-token>
```

Required permission:

```text
delete
```

Expected results:

```text
Admin  → 200 OK
Editor → 403 Forbidden
Viewer → 403 Forbidden
```

---

## HTTP Status Codes

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | A new user or resource was created |
| `400 Bad Request` | Request data is invalid |
| `401 Unauthorized` | Token is missing, invalid, or expired |
| `403 Forbidden` | The user is authenticated but lacks permission |
| `404 Not Found` | The route or resource does not exist |
| `409 Conflict` | A user with the same email already exists |
| `500 Internal Server Error` | An unexpected server error occurred |

---

## Postman Testing

The exported Postman files are available in:

```text
postman/
├── Authentication-System.postman_collection.json
└── Authentication-System-Local.postman_environment.json
```

### Import and Run

1. Open Postman.
2. Import the collection JSON file.
3. Import the environment JSON file.
4. Select the imported environment.
5. Start PostgreSQL.
6. Start both services.
7. Run the collection.

The environment contains:

```text
auth_url
resource_url
admin_token
editor_token
viewer_token
resource_id
```

Base URL values:

```text
auth_url = http://localhost:3001
resource_url = http://localhost:3002
```

The login requests save JWTs automatically in the environment variables:

```text
admin_token
editor_token
viewer_token
```

The Admin Create Resource request saves the created resource ID as:

```text
resource_id
```

Update and delete requests use:

```text
{{resource_url}}/resource/{{resource_id}}
```

---

## Expected Postman Results

| Request | Expected Status |
|---|---:|
| Auth health | `200` |
| Duplicate registration | `409` |
| Admin login | `200` |
| Editor login | `200` |
| Viewer login | `200` |
| Resource health | `200` |
| Request without token | `401` |
| Admin create | `201` |
| Editor create | `201` |
| Viewer create | `403` |
| Admin read | `200` |
| Editor read | `200` |
| Viewer read | `200` |
| Admin update | `200` |
| Editor update | `200` |
| Viewer update | `403` |
| Editor delete | `403` |
| Viewer delete | `403` |
| Admin delete | `200` |

Run the Admin Delete request last because it removes the resource stored in `resource_id`.

---

## Security

- Passwords are hashed using bcrypt.
- JWTs are signed by the Auth Service.
- The Resource Service verifies token signature, expiry, issuer, and audience.
- Permissions are enforced server-side.
- Helmet adds security-related HTTP response headers.
- CORS controls browser-based cross-origin access.
- Real `.env` files are excluded from Git.

---

## Git Ignore

The project excludes:

```gitignore
node_modules/
.env
coverage/
npm-debug.log*
.DS_Store
```

The following should remain included:

```text
.env.example
database/
postman/
README.md
```

---

## Permission Flow Example

Viewer attempts to create a resource:

```text
Valid viewer JWT
        ↓
Resource Service verifies the token
        ↓
Viewer role is authenticated
        ↓
Viewer does not have create permission
        ↓
403 Forbidden
```

Admin attempts to create a resource:

```text
Valid admin JWT
        ↓
Resource Service verifies the token
        ↓
Admin role has create permission
        ↓
Resource is created
        ↓
201 Created
```

---

## Summary

This project demonstrates JWT authentication and database-backed Role-Based Access Control using two separate backend services.

```text
Auth Service issues a JWT
        ↓
Resource Service verifies the JWT
        ↓
The required permission is checked in PostgreSQL
        ↓
The resource action is allowed or rejected
```

The system demonstrates:

- separate authentication and resource services;
- PostgreSQL-backed roles and permissions;
- server-side permission enforcement;
- correct `401` and `403` responses;
- admin, editor, and viewer permission behaviour;
- a reusable Postman demonstration.