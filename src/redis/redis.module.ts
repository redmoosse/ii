import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(options: {
    useFactory: (configService: ConfigService) => RedisOptions;
    inject: any[];
  }): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useFactory: async (configService: ConfigService) => {
            const redisOptions = options.useFactory(configService);
            return new Redis(redisOptions);
          },
          inject: options.inject,
        },
      ],
      exports: ['REDIS_CLIENT'],
    };
  }
}
