import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserType } from './user.type';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver()
export class UsersResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello, GraphQL!';
  }

  @Mutation(() => UserType)
  async register(@Args('registerInput') registerInput: CreateUserDto) {
    const { email, password } = registerInput;
    return this.userService.create(email, password);
  }

  @Mutation(() => UserType)
  async createWithBiometricKey(
    @Args('biometricInput') biometricInput: CreateUserDto,
  ) {
    const { email, biometricKey } = biometricInput;
    return this.userService.createWithBiometricKey(email, biometricKey);
  }
}
