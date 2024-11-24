import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

jest.mock('../config/supabase.config', () => ({
  createSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  })),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockConfigService = {
    get: jest.fn(() => 'mock-value'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
