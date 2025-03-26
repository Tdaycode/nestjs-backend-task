import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, AuthResolver, JwtService],
  imports: [UsersModule],
})
export class AuthModule {}
