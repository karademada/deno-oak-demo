#!/bin/bash

# Register a new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login and get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token to access protected routes (replace YOUR_TOKEN with actual token)
curl http://localhost:8000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN"

# Access protected Swagger UI (replace YOUR_TOKEN with actual token)
curl http://localhost:8000/api-docs \
  -H "Authorization: Bearer YOUR_TOKEN"
