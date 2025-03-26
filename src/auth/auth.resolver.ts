import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from '../auth/dto/login.input';
import { BiometricLoginInput } from '../auth/dto/biometric-login.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

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
