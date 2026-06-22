import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return user response', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      const createdUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await controller.createUser(dto);
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });
  });

  describe('findByEmail', () => {
    it('should return user response', async () => {
      const foundUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      mockUsersService.findByEmail.mockResolvedValue(foundUser);

      const result = await controller.findByEmail('test@test.com');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(controller.findByEmail('notfound@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMyProfile', () => {
    it('should return user profile if found', async () => {
      const foundUser = { id: 1, email: 'test@test.com', password: 'hashed' };
      mockUsersService.findById.mockResolvedValue(foundUser);

      const mockReq = { user: { sub: 1 } };
      const result = await controller.getMyProfile(mockReq as any);

      expect(mockUsersService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('should throw NotFoundException if user profile not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);

      const mockReq = { user: { sub: 999 } };
      await expect(controller.getMyProfile(mockReq as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
