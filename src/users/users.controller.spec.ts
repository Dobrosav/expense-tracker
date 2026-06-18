import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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
      await expect(controller.findByEmail('notfound@test.com')).rejects.toThrow(NotFoundException);
    });
  });
});
