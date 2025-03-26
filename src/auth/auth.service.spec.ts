import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      findByBiometricKey: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('standardLogin', () => {
    it('should successfully login a user with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const mockToken = 'jwt-token';

      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.standardLogin(
        'test@example.com',
        'password123',
      );
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.standardLogin('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        authService.standardLogin('test@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('biometricLogin', () => {
    it('should successfully login a user with a valid biometric key', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'jwt-token';

      (userService.findByBiometricKey as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.biometricLogin('validBiometricKey');
      expect(userService.findByBiometricKey).toHaveBeenCalledWith(
        'validBiometricKey',
      );
      expect(result).toEqual({ access_token: mockToken });
    });

    it('should throw UnauthorizedException if biometric key is invalid', async () => {
      (userService.findByBiometricKey as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.biometricLogin('invalidBiometricKey'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockToken = 'jwt-token';

      (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

      const result = authService['generateToken'](mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: '123', email: 'test@example.com' },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
        },
      );
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});
