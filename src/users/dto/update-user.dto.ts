import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEmail, MinLength } from 'class-validator';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  biometricKey?: string;
}
