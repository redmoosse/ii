import { Body, Controller, Post } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body('code') code: string) {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.GOOGLE_CALLBACK_URL;

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenRes.data;

    const userInfo = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userInfo.data;
    //TODO call auth.service function to create new User or find existing in DB and generate token.
    return this.authService.generateToken({
      email: user.email,
      name: user.name,
    });
  }
}
