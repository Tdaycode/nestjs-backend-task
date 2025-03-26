import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

jest.mock('bcrypt');
jest.mock('uuid');

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    const email = 'test@example.com';
    const password = 'testPassword123';
    const hashedPassword = 'hashedPassword123';
    const mockUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    it('should create a new user successfully', async () => {
      // Mock uuid generation
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      // Mock no existing user
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Mock bcrypt hash
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      // Mock Prisma create
      const mockUser = { id: mockUuid, email, password: hashedPassword };
      (mockPrismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.create(email, password);

      // Assertions
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email, password: hashedPassword },
      });
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(mockUuid);
    });

    it('should throw ConflictException if user already exists', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue({
        id: mockUuid,
        email,
      });

      await expect(userService.create(email, password)).rejects.toThrow(
        ConflictException,
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';
    const mockUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    it('should find a user by email', async () => {
      const mockUser = { id: mockUuid, email };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await userService.findByEmail(email);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(mockUuid);
    });

    it('should return null if no user is found', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('createWithBiometricKey', () => {
    const email = 'test@example.com';
    const biometricKey = 'uniqueBiometricKey123';
    const mockUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    it('should create a user with biometric key', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      const mockUser = { id: mockUuid, email, biometricKey };
      (mockPrismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createWithBiometricKey(
        email,
        biometricKey,
      );

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email, biometricKey },
      });
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(mockUuid);
    });
  });

  describe('findByBiometricKey', () => {
    const biometricKey = 'uniqueBiometricKey123';
    const mockUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    it('should find a user by biometric key', async () => {
      const mockUser = { id: mockUuid, biometricKey };
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await userService.findByBiometricKey(biometricKey);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { biometricKey },
      });
      expect(result).toEqual(mockUser);
      expect(result.id).toBe(mockUuid);
    });

    it('should return null if no user is found', async () => {
      (mockPrismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.findByBiometricKey(biometricKey);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { biometricKey },
      });
      expect(result).toBeNull();
    });
  });
});
