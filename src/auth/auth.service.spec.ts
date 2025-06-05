import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
            verify: jest.fn().mockReturnValue({ email: 'test@example.com', name: 'Test User' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateToken should create JWT token', async () => {
    const user = { email: 'test@example.com', name: 'Test User' };
    const result = await service.generateToken(user);

    expect(result).toEqual({"access_token": "mocked-jwt-token", "token_type": "bearer"});
    expect(jwtService.sign).toHaveBeenCalledWith(
      { email: 'test@example.com', name: 'Test User' }
    );
  });

  it('verify should parse info from JWT token', async () => {
    const token = 'mocked-jwt-token'
    const result = await service.verify(token);

    expect(result).toEqual({ email: 'test@example.com', name: 'Test User' });
    expect(jwtService.verify).toHaveBeenCalledWith(
      'mocked-jwt-token'
    );
  });

  it('verify should throw UNAUTHORIZED HttpException', async () => {
    const token = 'mocked-jwt-token';

    (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    await expect(service.verify(token)).rejects.toThrow(HttpException)
  });

});
