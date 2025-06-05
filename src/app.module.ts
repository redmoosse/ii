import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    ModelModule, 
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
