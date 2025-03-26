import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createWithBiometricKey(
    email: string,
    biometricKey: string,
    password: string,
  ) {
    return this.prisma.user.create({
      data: {
        email,
        biometricKey,
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async findByBiometricKey(biometricKey: string) {
    return this.prisma.user.findUnique({ where: { biometricKey } });
  }
}
