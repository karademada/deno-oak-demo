#!/bin/bash

# Replace YOUR_TOKEN with the token from login
TOKEN="YOUR_TOKEN"

# Create a book
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","description":"A classic novel"}'

# Get all books
curl http://localhost:8000/api/books \
  -H "Authorization: Bearer $TOKEN"

# Get book by ID (replace BOOK_ID with actual ID)
curl http://localhost:8000/api/books/BOOK_ID \
  -H "Authorization: Bearer $TOKEN"

# Update a book (replace BOOK_ID with actual ID)
curl -X PATCH http://localhost:8000/api/books/BOOK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Updated Title"}'

# Delete a book (replace BOOK_ID with actual ID)
curl -X DELETE http://localhost:8000/api/books/BOOK_ID \
  -H "Authorization: Bearer $TOKEN"
