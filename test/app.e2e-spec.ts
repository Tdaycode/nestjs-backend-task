import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service'; // Adjust import path
import { AppModule } from '../src/app.module';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    // Get Prisma service to manage test data
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    // Clear user data before each test to prevent conflicts
    await prisma.user.deleteMany({
      where: {
        OR: [{ email: 'test03@example.com' }, { email: 'test04@example.com' }],
      },
    });
  });

  it('should execute a simple hello query', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query { sayHello }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.sayHello).toBe('Hello, GraphQL!');
      });
  });

  describe('User Registration', () => {
    it('should successfully register a new user', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Register {
              register(registerInput: { 
                email: "test03@example.com", 
                password: "Omotayo@332" 
              }) {
                id
                email
                createdAt
                updatedAt
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.register.email).toBe('test03@example.com');
          expect(res.body.data.register.id).toBeDefined();
        });
    });

    it('should reject duplicate email registration', async () => {
      // First, register a user
      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Register {
              register(registerInput: { 
                email: "test03@example.com", 
                password: "Omotayo@332" 
              }) {
                id
                email
              }
            }
          `,
        });

      // Then try to register with same email
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Register {
              register(registerInput: { 
                email: "test03@example.com", 
                password: "Omotayo@332" 
              }) {
                id
                email
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          // Expect an error response for duplicate email
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeNull();
        });
    });

    it('should reject invalid email format', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation Register {
              register(registerInput: { 
                email: "invalid-email", 
                password: "Omotayo@332" 
              }) {
                id
                email
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeNull();
        });
    });

    afterAll(async () => {
      // Clean up after all tests
      await prisma.user.deleteMany({
        where: {
          OR: [
            { email: 'test03@example.com' },
            { email: 'test04@example.com' },
          ],
        },
      });
      await app.close();
    });
  });
});
