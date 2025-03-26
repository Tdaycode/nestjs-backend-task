import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * The function creates a new user with a hashed password if the user does not already exist.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user being created.
   * @param {string} password - The `create` function you provided is used to create a new user in a
   * database. The function takes in two parameters: `email` and `password`.
   * @returns The `create` method is returning a Promise that resolves to the newly created user object
   * with the provided email and hashed password.
   */
  async create(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  /**
   * This TypeScript function asynchronously finds a user by their email using Prisma.
   * @param {string} email - The `findByEmail` function is an asynchronous function that takes an `email`
   * parameter of type string. It uses Prisma to find a unique user based on the provided email address.
   * @returns The `findByEmail` function is returning the result of calling `this.prisma.user.findUnique`
   * with the provided email as the search criteria. This function is likely querying a database to find
   * a user with the specified email address.
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  /**
   * The function creates a new user with a biometric key if the user does not already exist.
   * @param {string} email - The `email` parameter is a string that represents the email address of the
   * user being created.
   * @param {string} biometricKey - The `biometricKey` parameter is a string that represents the biometric
   * key associated with the user being created. This key is used for authentication purposes.
   * @returns The `createWithBiometricKey` method is returning a Promise that resolves to the newly
   * created user object with the provided email and biometric key.
   */
  async createWithBiometricKey(email: string, biometricKey: string) {
    return this.prisma.user.create({
      data: {
        email,
        biometricKey,
      },
    });
  }

  /**
   * The function findByBiometricKey asynchronously retrieves a user record based on a provided biometric
   * key.
   * @param {string} biometricKey - The `findByBiometricKey` function is an asynchronous function that
   * takes a `biometricKey` parameter of type string. This function uses Prisma to find a unique user
   * based on the provided `biometricKey`.
   * @returns The `findByBiometricKey` function is returning a Promise that resolves to the result of
   * calling `this.prisma.user.findUnique({ where: { biometricKey } })`. This function is finding a user
   * with the specified `biometricKey` in the database using Prisma's `findUnique` method.
   */
  async findByBiometricKey(biometricKey: string) {
    return this.prisma.user.findUnique({ where: { biometricKey } });
  }
}
