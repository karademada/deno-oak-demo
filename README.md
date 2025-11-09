# Deno Oak Demo - Books API

A RESTful API built with Deno and Oak framework for managing books, featuring validation, Swagger documentation, and Deno KV storage.

Based on: [Building RESTful APIs with Deno and Oak](https://www.telerik.com/blogs/building-restful-apis-deno-oak)

## Features

- JWT authentication with bcrypt password hashing
- Protected API routes
- CRUD operations for books
- Request validation with Joi
- OpenAPI/Swagger documentation (protected)
- Deno KV for data persistence
- Comprehensive test suite

## Prerequisites

- [Deno](https://deno.land/) 1.x or higher

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd deno-oak-demo

# Install dependencies (automatic on first run)
deno cache main.ts
```

## Running the Application

```bash
# Development mode (with auto-reload)
deno task dev

# Production mode
deno task start
```

Server runs on: http://localhost:8000

API Documentation: http://localhost:8000/api-docs

## Testing

```bash
deno task test
```

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Books (Protected - Requires JWT)
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a book
- `PATCH /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Documentation (Public)
- `GET /api-docs` - Swagger UI
- `GET /api-docs.json` - OpenAPI spec

## Example Requests

See [auth-requests.sh](./auth-requests.sh) for authentication examples.
See [api-requests.sh](./api-requests.sh) for book API examples.

## Project Structure

This project follows **Clean Architecture**, **DDD**, and **TDD** principles.

```
src/
├── domain/              # Business entities and rules
│   ├── book/           # Book entity and repository interface
│   └── user/           # User entity and repository interface
├── application/         # Use cases (business logic)
│   ├── book/           # Book use cases
│   └── auth/           # Auth use cases
├── infrastructure/      # External concerns
│   ├── persistence/    # Repository implementations (KV)
│   └── http/           # Controllers, middleware, routes
└── shared/             # Shared utilities
    ├── errors/         # Custom error classes
    └── config.ts       # Configuration
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.
