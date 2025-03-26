import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * The `standardLogin` function in TypeScript performs user authentication by checking the email and
   * password against the database and generating a token if the credentials are valid.
   * @param {string} email - The `standardLogin` function you provided is an asynchronous function that
   * handles user authentication by checking the provided email and password against the stored user
   * data. It first retrieves the user by email using the `findByEmail` method from the `userService`. If
   * the user is not found, it throws an `Unauthorized
   * @param {string} password - The `password` parameter in the `standardLogin` function is a string that
   * represents the password input provided by the user during the login process. This password is then
   * compared with the hashed password stored in the database for the user account to verify the user's
   * identity.
   * @returns The `standardLogin` function is returning the result of the `generateToken` method with the
   * `user` object as its argument.
   */
  async standardLogin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  /**
   * The `biometricLogin` function in TypeScript asynchronously verifies a user's biometric key and
   * generates a token if successful.
   * @param {string} biometricKey - The `biometricKey` parameter in the `biometricLogin` function is a
   * string that represents the biometric key used for authentication. This key is passed to the function
   * to retrieve the user associated with it from the user service. If the user is found, a token is
   * generated for that user
   * @returns The function `biometricLogin` is returning the result of the `generateToken` method with
   * the `user` object as its argument.
   */
  async biometricLogin(biometricKey: string) {
    const user = await this.userService.findByBiometricKey(biometricKey);

    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    return this.generateToken(user);
  }

  /**
   * The function generates a JWT token with a payload containing user ID and email.
   * @param {any} user - The `user` parameter in the `generateToken` function is an object that
   * represents a user. It typically contains properties such as `id` and `email` that are used to
   * generate a JWT token for authentication and authorization purposes.
   * @returns An object is being returned with a property `access_token` that contains a JWT token
   * generated using the `jwtService.sign` method. The JWT token is signed with a payload containing the
   * user's id and email, and it is configured to expire after a certain time specified by the
   * `JWT_EXPIRATION_TIME` environment variable or defaulting to '1h'. The token is signed using a secret
   * key
   */
  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
      }),
    };
  }
}
