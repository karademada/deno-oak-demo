#!/bin/bash

# Create a book
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","description":"A classic novel"}'

curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"To Kill a Mockingbird","author":"Harper Lee","description":"A powerful story of racial injustice"}'

curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","description":"A dystopian novel"}'

curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Pride and Prejudice","author":"Jane Austen","description":"A romantic novel"}'

curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Catcher in the Rye","author":"J.D. Salinger","description":"A coming-of-age story"}'
# Get all books
curl http://localhost:8000/api/books

# Get book by ID (replace BOOK_ID with actual ID)
curl http://localhost:8000/api/books/f8575963-08ce-4859-ae77-5a3f78252180

# Update a book (replace BOOK_ID with actual ID)
curl -X PATCH http://localhost:8000/api/books/f8575963-08ce-4859-ae77-5a3f78252180 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete a book (replace BOOK_ID with actual ID)
curl -X DELETE http://localhost:8000/api/books/f8575963-08ce-4859-ae77-5a3f78252180
