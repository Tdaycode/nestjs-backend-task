import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { UserType } from '../users/user.type';
import { RegisterInput } from '../auth/dto/register.input';
import { LoginInput } from '../auth/dto/login.input';
import { BiometricLoginInput } from '../auth/dto/biometric-login.input';

@Resolver()
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello, GraphQL!';
  }

  @Mutation(() => UserType)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const { email, password } = registerInput;
    return this.userService.create(email, password);
  }

  @Mutation(() => String)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const { email, password } = loginInput;
    const { access_token } = await this.authService.standardLogin(
      email,
      password,
    );
    return access_token;
  }

  @Mutation(() => String)
  async biometricLogin(
    @Args('biometricLoginInput') biometricLoginInput: BiometricLoginInput,
  ) {
    const { biometricKey } = biometricLoginInput;
    const { access_token } = await this.authService.biometricLogin(
      biometricKey,
    );
    return access_token;
  }
}
