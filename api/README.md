# Library Management System API

A RESTful API for managing library resources including books, authors, members, and loan transactions.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
  - [Authors](#authors)
  - [Books](#books)
  - [Members](#members)
  - [Loans](#loans)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the PostgreSQL database:

```bash
docker compose up -d
```

3. Push the database schema:

```bash
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:6767`.

### Health Check

```bash
GET /health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-11T18:00:00.000Z"
}
```

---

## Configuration

Environment variables are configured in the `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `6767` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `*` |
| `CORS_CREDENTIALS` | Enable credentials in CORS | `true` |
| `SHUTDOWN_TIMEOUT_MS` | Graceful shutdown timeout | `10000` |
| `LOG_LEVEL` | Log level | `info` |

Example `.env` file:

```
PORT=6767
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
CORS_ORIGINS="*"
CORS_CREDENTIALS=true
SHUTDOWN_TIMEOUT_MS=10000
LOG_LEVEL=info
```

---

## API Reference

All endpoints are prefixed with `/api`. Responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

### Authors

#### List All Authors

```
GET /api/authors
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author",
      "createdAt": "2026-01-11T18:00:00.000Z",
      "updatedAt": "2026-01-11T18:00:00.000Z",
      "books": []
    }
  ]
}
```

#### Get Author by ID

```
GET /api/authors/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "bio": "British author",
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-11T18:00:00.000Z",
    "books": [
      {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone",
        "isbn": "978-0-7475-3269-9"
      }
    ]
  }
}
```

#### Create Author

```
POST /api/authors
Content-Type: application/json
```

Request body:

```json
{
  "name": "J.K. Rowling",
  "bio": "British author known for the Harry Potter series"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Author's full name |
| `bio` | string | No | Author biography |

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "bio": "British author known for the Harry Potter series",
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-11T18:00:00.000Z"
  }
}
```

#### Update Author

```
PUT /api/authors/:id
Content-Type: application/json
```

Request body:

```json
{
  "bio": "Updated biography text"
}
```

All fields are optional. Only provided fields will be updated.

#### Delete Author

```
DELETE /api/authors/:id
```

Response:

```json
{
  "success": true,
  "message": "Author deleted successfully"
}
```

---

### Books

#### List All Books

```
GET /api/books
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "isbn": "978-0-7475-3269-9",
      "publishedYear": 1997,
      "quantity": 5,
      "authorId": 1,
      "createdAt": "2026-01-11T18:00:00.000Z",
      "updatedAt": "2026-01-11T18:00:00.000Z",
      "author": {
        "id": 1,
        "name": "J.K. Rowling"
      }
    }
  ]
}
```

#### Get Book by ID

```
GET /api/books/:id
```

Response includes the book's author and loan history.

#### Create Book

```
POST /api/books
Content-Type: application/json
```

Request body:

```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "isbn": "978-0-7475-3269-9",
  "publishedYear": 1997,
  "quantity": 5,
  "authorId": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Book title |
| `isbn` | string | Yes | Unique ISBN identifier |
| `publishedYear` | integer | No | Year of publication |
| `quantity` | integer | No | Number of copies (default: 1) |
| `authorId` | integer | Yes | ID of the author |

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Harry Potter and the Philosopher's Stone",
    "isbn": "978-0-7475-3269-9",
    "publishedYear": 1997,
    "quantity": 5,
    "authorId": 1,
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-11T18:00:00.000Z",
    "author": {
      "id": 1,
      "name": "J.K. Rowling"
    }
  }
}
```

#### Update Book

```
PUT /api/books/:id
Content-Type: application/json
```

Request body:

```json
{
  "quantity": 10
}
```

All fields are optional. Only provided fields will be updated.

#### Delete Book

```
DELETE /api/books/:id
```

Response:

```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

### Members

#### List All Members

```
GET /api/members
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "membershipDate": "2026-01-11T18:00:00.000Z",
      "createdAt": "2026-01-11T18:00:00.000Z",
      "updatedAt": "2026-01-11T18:00:00.000Z"
    }
  ]
}
```

#### Get Member by ID

```
GET /api/members/:id
```

Response includes the member's loan history with book details.

#### Create Member

```
POST /api/members
Content-Type: application/json
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Member's full name |
| `email` | string | Yes | Unique email address |
| `phone` | string | No | Contact phone number |

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "membershipDate": "2026-01-11T18:00:00.000Z",
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-11T18:00:00.000Z"
  }
}
```

#### Update Member

```
PUT /api/members/:id
Content-Type: application/json
```

Request body:

```json
{
  "phone": "+0987654321"
}
```

All fields are optional. Only provided fields will be updated.

#### Delete Member

```
DELETE /api/members/:id
```

Response:

```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

---

### Loans

#### List All Loans

```
GET /api/loans
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookId": 1,
      "memberId": 1,
      "borrowDate": "2026-01-11T18:00:00.000Z",
      "dueDate": "2026-01-25T18:00:00.000Z",
      "returnDate": null,
      "status": "BORROWED",
      "createdAt": "2026-01-11T18:00:00.000Z",
      "updatedAt": "2026-01-11T18:00:00.000Z",
      "book": {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone"
      },
      "member": {
        "id": 1,
        "name": "John Doe"
      }
    }
  ]
}
```

#### Borrow a Book

```
POST /api/loans/borrow
Content-Type: application/json
```

Request body:

```json
{
  "bookId": 1,
  "memberId": 1,
  "dueDate": "2026-01-25T18:00:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `bookId` | integer | Yes | ID of the book to borrow |
| `memberId` | integer | Yes | ID of the borrowing member |
| `dueDate` | string (ISO 8601) | No | Due date (default: 14 days from now) |

Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookId": 1,
    "memberId": 1,
    "borrowDate": "2026-01-11T18:00:00.000Z",
    "dueDate": "2026-01-25T18:00:00.000Z",
    "returnDate": null,
    "status": "BORROWED",
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-11T18:00:00.000Z",
    "book": { ... },
    "member": { ... }
  }
}
```

The API validates that:
- The book exists
- The member exists
- There are available copies of the book (not all copies are currently borrowed)

#### Return a Book

```
POST /api/loans/return/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookId": 1,
    "memberId": 1,
    "borrowDate": "2026-01-11T18:00:00.000Z",
    "dueDate": "2026-01-25T18:00:00.000Z",
    "returnDate": "2026-01-15T18:00:00.000Z",
    "status": "RETURNED",
    "createdAt": "2026-01-11T18:00:00.000Z",
    "updatedAt": "2026-01-15T18:00:00.000Z",
    "book": { ... },
    "member": { ... }
  }
}
```

#### Get Member Loan History

```
GET /api/loans/member/:memberId
```

Returns all loans for a specific member, ordered by borrow date (most recent first).

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookId": 1,
      "memberId": 1,
      "borrowDate": "2026-01-11T18:00:00.000Z",
      "dueDate": "2026-01-25T18:00:00.000Z",
      "returnDate": "2026-01-15T18:00:00.000Z",
      "status": "RETURNED",
      "book": {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone"
      }
    }
  ]
}
```

---

## Error Handling

### Validation Errors

When request body validation fails, the API returns a 400 status code:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Not Found Errors

When a resource is not found, the API returns a 404 status code:

```json
{
  "success": false,
  "message": "Book not found"
}
```

### Business Logic Errors

For business rule violations, the API returns a 400 status code:

```json
{
  "success": false,
  "message": "No copies available for borrowing"
}
```

```json
{
  "success": false,
  "message": "Book already returned"
}
```

### Route Not Found

For undefined routes:

```json
{
  "success": false,
  "message": "Route GET /api/undefined not found"
}
```

---

## Data Models

### Author

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `name` | string | Author's full name |
| `bio` | string | Author biography (nullable) |
| `createdAt` | datetime | Record creation timestamp |
| `updatedAt` | datetime | Record update timestamp |
| `books` | Book[] | Related books |

### Book

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `title` | string | Book title |
| `isbn` | string | Unique ISBN identifier |
| `publishedYear` | integer | Year of publication (nullable) |
| `quantity` | integer | Number of copies |
| `authorId` | integer | Foreign key to Author |
| `createdAt` | datetime | Record creation timestamp |
| `updatedAt` | datetime | Record update timestamp |
| `author` | Author | Related author |
| `loans` | Loan[] | Related loans |

### Member

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `name` | string | Member's full name |
| `email` | string | Unique email address |
| `phone` | string | Contact phone (nullable) |
| `membershipDate` | datetime | Date of membership |
| `createdAt` | datetime | Record creation timestamp |
| `updatedAt` | datetime | Record update timestamp |
| `loans` | Loan[] | Related loans |

### Loan

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `bookId` | integer | Foreign key to Book |
| `memberId` | integer | Foreign key to Member |
| `borrowDate` | datetime | Date book was borrowed |
| `dueDate` | datetime | Expected return date |
| `returnDate` | datetime | Actual return date (nullable) |
| `status` | enum | BORROWED, RETURNED, or OVERDUE |
| `createdAt` | datetime | Record creation timestamp |
| `updatedAt` | datetime | Record update timestamp |
| `book` | Book | Related book |
| `member` | Member | Related member |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
