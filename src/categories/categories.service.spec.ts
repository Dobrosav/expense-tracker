import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const mockCategoryRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useFactory: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create and return a new category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Food' };
      const userId = 1;
      const createdCategory = { id: 1, name: 'food', user: { id: userId } };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(createdCategory as any);
      repository.save.mockResolvedValue(createdCategory as any);

      const result = await service.createCategory(createCategoryDto, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: 'food', user: { id: userId } },
      });
      expect(repository.create).toHaveBeenCalledWith({
        name: 'food',
        user: { id: userId },
      });
      expect(repository.save).toHaveBeenCalledWith(createdCategory);
      expect(result).toEqual(createdCategory);
    });

    it('should throw ConflictException if category already exists', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Food' };
      const userId = 1;
      const existingCategory = { id: 1, name: 'food', user: { id: userId } };

      repository.findOne.mockResolvedValue(existingCategory as any);

      await expect(
        service.createCategory(createCategoryDto, userId),
      ).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: 'food', user: { id: userId } },
      });
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllCategoriesByUserId', () => {
    it('should return an array of categories', async () => {
      const userId = 1;
      const categories = [{ id: 1, name: 'food', user: { id: userId } }];

      repository.find.mockResolvedValue(categories as any);

      const result = await service.findAllCategoriesByUserId(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
      });
      expect(result).toEqual(categories);
    });
  });

  describe('findOneCategory', () => {
    it('should return a category if found', async () => {
      const categoryId = 1;
      const category = { id: categoryId, name: 'food' };

      repository.findOne.mockResolvedValue(category as any);

      const result = await service.findOneCategory(categoryId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if category is not found', async () => {
      const categoryId = 1;

      repository.findOne.mockResolvedValue(null);

      await expect(service.findOneCategory(categoryId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });
  });

  describe('updateCategory', () => {
    it('should update and return the category', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Drinks' };
      const existingCategory = { id: categoryId, name: 'food' };
      const updatedCategory = { id: categoryId, name: 'Drinks' };

      jest
        .spyOn(service, 'findOneCategory')
        .mockResolvedValue(existingCategory as any);
      repository.save.mockResolvedValue(updatedCategory as any);

      const result = await service.updateCategory(
        categoryId,
        updateCategoryDto,
      );

      expect(service.findOneCategory).toHaveBeenCalledWith(categoryId);
      expect(existingCategory.name).toEqual('Drinks');
      expect(repository.save).toHaveBeenCalledWith(existingCategory);
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category to update is not found', async () => {
      const categoryId = 1;
      const updateCategoryDto: UpdateCategoryDto = { name: 'Drinks' };

      jest
        .spyOn(service, 'findOneCategory')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.updateCategory(categoryId, updateCategoryDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.findOneCategory).toHaveBeenCalledWith(categoryId);
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('removeCategory', () => {
    it('should remove the category', async () => {
      const categoryId = 1;

      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.removeCategory(categoryId);

      expect(repository.delete).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('findCategoryByName', () => {
    it('should return category by name and user id', async () => {
      const name = 'food';
      const userId = 1;
      const category = { id: 1, name, user: { id: userId } };

      repository.findOne.mockResolvedValue(category as any);

      const result = await service.findCategoryByName(name, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name, user: { id: userId } },
      });
      expect(result).toEqual(category);
    });
  });
});
