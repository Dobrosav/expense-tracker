import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const hashedPassword = 'hashedPassword';
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      
      const newUser = { email: 'test@test.com', password: hashedPassword };
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockResolvedValue({ id: 1, ...newUser });

      const result = await service.create('test@test.com', 'password');
      expect(result).toEqual({ id: 1, ...newUser });
    });

    it('should throw ConflictException if user exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: 'test@test.com' });
      await expect(service.create('test@test.com', 'password')).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toEqual(user);
    });

    it('should return null if user not found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found by id', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(user);
    });

    it('should return null if user not found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });
});
