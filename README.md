# NestJS Biometric Authentication Backend

## Prerequisites
- Node.js (v16 or later)
- Docker
- PostgreSQL

## Environment Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in the required variables

4. Start PostgreSQL database using Docker:
```bash
docker-compose up -d
```

5. Run Prisma migrations:
```bash
npx prisma migrate dev
```

6. Start the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Testing
Run tests using:
```bash
npm test
```

## Project Structure
- `src/`: Source code
  - `auth/`: Authentication modules
  - `users/`: User-related modules
  - `prisma/`: Database schema
  - `graphql/`: GraphQL schema definitions

## Endpoints
- GraphQL Playground: `http://localhost:3000/graphql`
- User Registration
- Standard Login
- Biometric Login

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `JWT_EXPIRATION`: Token expiration time