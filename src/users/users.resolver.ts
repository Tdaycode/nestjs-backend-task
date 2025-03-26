import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './users.service';
import { RegisterInput } from '../auth/dto/register.input';
import { UserType } from './user.type';

@Resolver()
export class UsersResolver {
  constructor(private userService: UserService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello, GraphQL!';
  }

  @Mutation(() => UserType)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const { email, password } = registerInput;
    return this.userService.create(email, password);
  }
}
