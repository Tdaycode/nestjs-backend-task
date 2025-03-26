import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UserService, UsersResolver],
  imports: [PrismaModule],
  exports: [UserService],
})
export class UsersModule {}
