// auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should exchange code for token and return generated JWT', async () => {
    const mockCode = 'mock-google-code';
    const mockAccessToken = 'mock-access-token';
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
    };
    const mockJwtToken = {
      access_token: 'jwt.token.here',
      token_type: 'bearer',
    };

    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: mockAccessToken },
    });

    mockedAxios.get.mockResolvedValueOnce({
      data: mockUser,
    });

    (authService.generateToken as jest.Mock).mockResolvedValueOnce(mockJwtToken);

    const result = await controller.googleAuth(mockCode);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://oauth2.googleapis.com/token',
      expect.objectContaining({
        code: mockCode,
        grant_type: 'authorization_code',
      }),
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${mockAccessToken}`,
        },
      },
    );

    expect(authService.generateToken).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.name,
    });

    expect(result).toEqual(mockJwtToken);
  });

  it('should throw if token exchange fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Token request failed'));

    await expect(controller.googleAuth('invalid-code')).rejects.toThrow('Token request failed');
  });

  it('should throw if user info fetch fails', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'some-token' },
    });

    mockedAxios.get.mockRejectedValueOnce(new Error('User info failed'));

    await expect(controller.googleAuth('valid-code')).rejects.toThrow('User info failed');
  });
});
