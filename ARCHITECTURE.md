# Clean Architecture - Project Structure

This project follows Clean Architecture, DDD, and TDD principles.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)
- **Entities**: Core business objects (Book, User)
- **Repository Interfaces**: Contracts for data access
- **Business Logic**: Pure domain logic, no dependencies

### 2. Application Layer (`src/application/`)
- **Use Cases**: Application-specific business rules
- **Orchestrates**: Domain entities and repository interfaces
- **Independent**: No framework dependencies

### 3. Infrastructure Layer (`src/infrastructure/`)
- **Persistence**: Repository implementations (KV storage)
- **HTTP**: Controllers, middleware, routing
- **External**: Framework-specific code

### 4. Shared Layer (`src/shared/`)
- **Errors**: Custom error classes
- **Config**: Application configuration
- **Types**: Shared type definitions

## Dependency Rule

Dependencies point inward:
```
Infrastructure → Application → Domain
```

- Domain has no dependencies
- Application depends only on Domain
- Infrastructure depends on Application and Domain

## Key Principles

### Clean Architecture
- Separation of concerns
- Dependency inversion
- Framework independence
- Testability

### Domain-Driven Design (DDD)
- Entities with business logic
- Repository pattern
- Domain models separate from DTOs

### Test-Driven Development (TDD)
- Unit tests for entities
- Use case tests with mocks
- Test files alongside source code

## Testing Strategy

- **Unit Tests**: Domain entities (`.entity.test.ts`)
- **Integration Tests**: Use cases with mocks (`.usecase.test.ts`)
- **E2E Tests**: HTTP controllers (`.controller.test.ts`)

## Benefits

1. **Maintainability**: Clear separation of concerns
2. **Testability**: Easy to mock and test
3. **Flexibility**: Easy to swap implementations
4. **Scalability**: Organized structure for growth
