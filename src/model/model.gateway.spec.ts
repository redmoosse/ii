import { Test, TestingModule } from '@nestjs/testing';
import { ModelGateway } from './model.gateway';
import { ModelService } from './model.service';

describe('ModelGateway', () => {
  let gateway: ModelGateway;
  let modelService: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelGateway,
        {
          provide: ModelService,
          useValue: {
            sendRequestToModel: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ModelGateway>(ModelGateway);
    modelService = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleQuestion', () => {
    const mockClient = {
      emit: jest.fn(),
      id: 'client123',
    } as any;

    it('should return event answer with data on success', async () => {
      const mockResult = { answer: 'some answer' };
      (modelService.sendRequestToModel as jest.Mock).mockResolvedValue(mockResult);

      const data = 'question text';
      const response = await gateway.handleQuestion(data, mockClient);

      expect(modelService.sendRequestToModel).toHaveBeenCalledWith({ text: data });
      expect(response).toEqual({ event: 'answer', data: mockResult });
      expect(mockClient.emit).not.toHaveBeenCalledWith('error', expect.anything());
    });

    it('should emit error and return event error on failure', async () => {
      const error = new Error('fail');
      (modelService.sendRequestToModel as jest.Mock).mockRejectedValue(error);

      const data = 'question text';
      const response = await gateway.handleQuestion(data, mockClient);

      expect(modelService.sendRequestToModel).toHaveBeenCalledWith({ text: data });
      expect(mockClient.emit).toHaveBeenCalledWith('error', 'Internal server error');
      expect(response).toEqual({ event: 'error', data: 'Something went wrong' });
    });
  });
});
