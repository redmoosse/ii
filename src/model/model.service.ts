import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ModelRequestDto } from './dto/model-request.dto';

@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendRequestToModel(dto: ModelRequestDto): Promise<any> {
    const modelUrl = process.env.MODEL_HOST;
    const { text } = dto;

    try {
      const response = this.httpService.post(
        `http://${modelUrl}/process`,
        { text }
      ).pipe(
        map(res => res.data),
        catchError((error) => {
          this.logger.error('Error calling model API', error?.response?.data || error.message);
          throw new HttpException(
            'Failed to communicate with the model service',
            HttpStatus.BAD_GATEWAY
          );
        })
      );

      return await lastValueFrom(response);

    } catch (error) {
      this.logger.error('Unexpected error in ModelService', error.message || error);
      throw new HttpException(
        'Internal server error while processing the request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
