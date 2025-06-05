import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: any) {
    const payload = { email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'bearer',
    };
  }

  async verify(token: string) {
    try {
        return this.jwtService.verify(token);
    } catch (err) {
        throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
