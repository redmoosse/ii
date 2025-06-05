import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModelRequestDto } from './dto/model-request.dto';
import { ModelService } from './model.service';

@ApiTags('Model')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post('question')
  @ApiOperation({ summary: 'Send question to model for processing' })
  @ApiBody({ type: ModelRequestDto })
  @ApiResponse({ status: 200, description: 'Model response returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 502, description: 'Model service is unavailable' })
  @ApiResponse({ status: 502, description: 'Internal server error' })
  async callModel(@Body() dto: ModelRequestDto) {
    return this.modelService.sendRequestToModel(dto);
  }
}
