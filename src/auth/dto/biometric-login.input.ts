import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class BiometricLoginInput {
  @Field()
  @IsNotEmpty()
  biometricKey: string;
}
