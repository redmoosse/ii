import { Test, TestingModule } from '@nestjs/testing';
import { ModelRequestDto } from './dto/model-request.dto';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

describe('ModelController', () => {
  let controller: ModelController;
  let service: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [
        {
          provide: ModelService,
          useValue: {
            sendRequestToModel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ModelController>(ModelController);
    service = module.get<ModelService>(ModelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service with DTO and return result', async () => {
    const dto: ModelRequestDto = { text: 'I felt a sharp pain in the lower abdomen on the right side.' };
    const expectedResult = { 
      success: "true",
      diagnosis: "Diagnosis",
      direction: "Direction" 
    };

    jest.spyOn(service, 'sendRequestToModel').mockResolvedValue(expectedResult);

    const result = await controller.callModel(dto);

    expect(service.sendRequestToModel).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expectedResult);
  });
});
