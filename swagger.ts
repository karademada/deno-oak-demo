export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Books API",
    version: "1.0.0",
    description: "API for managing books with authentication",
  },
  servers: [{ url: "http://localhost:8000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Book: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          author: { type: "string" },
          description: { type: "string" },
        },
      },
      CreateBook: {
        type: "object",
        required: ["title", "author"],
        properties: {
          title: { type: "string", minLength: 1, maxLength: 200 },
          author: { type: "string", minLength: 1, maxLength: 100 },
          description: { type: "string", maxLength: 1000 },
        },
      },
      UpdateBook: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1, maxLength: 200 },
          author: { type: "string", minLength: 1, maxLength: 100 },
          description: { type: "string", maxLength: 1000 },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["USER", "ADMIN"] },
          createdAt: { type: "string" },
        },
      },
      UpdateUserRole: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["USER", "ADMIN"] },
        },
      },
      CreateUser: {
        type: "object",
        required: ["email", "password", "role"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["USER", "ADMIN"] },
        },
      },
      Register: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["USER", "ADMIN"] },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Register" } } },
        },
        responses: {
          201: { description: "User registered", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "User already exists" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } },
        },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" } } } } } },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/books": {
      get: {
        summary: "Get all books",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of books",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Book" } },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBook" },
            },
          },
        },
        responses: {
          201: { description: "Book created", content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } } },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/users": {
      post: {
        summary: "Create user (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUser" } } },
        },
        responses: {
          201: { description: "User created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "User already exists" },
          403: { description: "Forbidden" },
        },
      },
      get: {
        summary: "Get all users (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "List of users", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user by ID (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User found", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "User not found" },
          403: { description: "Forbidden" },
        },
      },
      delete: {
        summary: "Delete user (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "User deleted" },
          404: { description: "User not found" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/users/{id}/role": {
      patch: {
        summary: "Update user role (Admin only)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRole" } } },
        },
        responses: {
          200: { description: "User role updated", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "User not found" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        summary: "Get book by ID",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Book found", content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } } },
          404: { description: "Book not found" },
        },
      },
      patch: {
        summary: "Update a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateBook" } } },
        },
        responses: {
          200: { description: "Book updated" },
          404: { description: "Book not found" },
        },
      },
      delete: {
        summary: "Delete a book",
        tags: ["Books"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Book deleted" },
          404: { description: "Book not found" },
        },
      },
    },
  },

};
