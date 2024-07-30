import { Test, TestingModule } from '@nestjs/testing';
import { PollGateway } from './polls.gateway';

describe('PollGateway', () => {
  let gateway: PollGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollGateway],
    }).compile();

    gateway = module.get<PollGateway>(PollGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
