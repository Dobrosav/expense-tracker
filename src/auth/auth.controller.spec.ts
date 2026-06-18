import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'test-token' });
      const result = await controller.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'password');
    });
  });
});
