import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ModelController } from './model.controller';
import { ModelGateway } from './model.gateway';
import { ModelService } from './model.service';

@Module({
  imports: [HttpModule],
  controllers: [ModelController],
  providers: [ModelService, ModelGateway],
})
export class ModelModule {}
