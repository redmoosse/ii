import { HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { ModelService } from './model.service';

process.env.MODEL_HOST = '127.0.0.1:5000';

describe('ModelService', () => {
  let service: ModelService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ModelService>(ModelService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send request to model and return response', async () => {
    const dto = { text: 'I felt a sharp pain in the lower abdomen on the right side.' };
    const mockResponse: AxiosResponse = {
      data: { 
        success: "true",
        diagnosis: "Diagnosis",
        direction: "Direction" 
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders()
      },
    };

    jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

    const result = await service.sendRequestToModel(dto);

    expect(result).toEqual({ 
      success: "true",
      diagnosis: "Diagnosis",
      direction: "Direction" 
    });
    expect(httpService.post).toHaveBeenCalledWith(
      `http://${process.env.MODEL_HOST}/process`,
      { text: 'I felt a sharp pain in the lower abdomen on the right side.' }
    );
  });

  it('should throw HttpException when model API fails', async () => {
    const dto = { text: 'I felt a sharp pain in the lower abdomen on the right side.' };

    const mockError: Partial<AxiosError> = {
      response: {
        data: 'Error calling model API',
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {
          headers: new AxiosHeaders(),
        },
      },
      message: 'Request failed',
      name: 'AxiosError',
      isAxiosError: true,
      toJSON: () => ({}),
      config: {
        headers: new AxiosHeaders(),
      }
    };

    jest.spyOn(httpService, 'post').mockReturnValueOnce(throwError(() => mockError as AxiosError));

    await expect(service.sendRequestToModel(dto)).rejects.toThrow(HttpException);
  });
});