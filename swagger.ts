export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Books API",
    version: "1.0.0",
    description: "API for managing books",
  },
  servers: [{ url: "http://localhost:8000" }],
  paths: {
    "/api/books": {
      get: {
        summary: "Get all books",
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
    "/api/books/{id}": {
      get: {
        summary: "Get book by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Book found", content: { "application/json": { schema: { $ref: "#/components/schemas/Book" } } } },
          404: { description: "Book not found" },
        },
      },
      patch: {
        summary: "Update a book",
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
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          204: { description: "Book deleted" },
          404: { description: "Book not found" },
        },
      },
    },
  },
  components: {
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
    },
  },
};
