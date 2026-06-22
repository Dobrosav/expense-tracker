import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Category } from './entities/category.entity';

const mockCategoriesService = () => ({
  createCategory: jest.fn(),
  findAllCategoriesByUserId: jest.fn(),
  updateCategory: jest.fn(),
  removeCategory: jest.fn(),
});

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: jest.Mocked<CategoriesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useFactory: mockCategoriesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Food' };
      const userId = 1;
      const req = { user: { sub: userId } };

      const newCategory = new Category();
      newCategory.id = 1;
      newCategory.name = 'food';

      const expectedResponse = new CreateCategoryDto();
      expectedResponse.name = 'food';

      service.createCategory.mockResolvedValue(newCategory);

      const result = await controller.create(req, createCategoryDto);

      expect(service.createCategory).toHaveBeenCalledWith(
        createCategoryDto,
        userId,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAllCategoriesByUserId', () => {
    it('should return all categories for user', async () => {
      const userId = 1;
      const req = { user: { sub: userId } };

      const category = new Category();
      category.id = 1;
      category.name = 'food';

      const expectedResponse = new CategoryResponseDto();
      expectedResponse.id = 1;
      expectedResponse.name = 'food';

      service.findAllCategoriesByUserId.mockResolvedValue([category]);

      const result = await controller.findAllCategoriesByUserId(req);

      expect(service.findAllCategoriesByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const categoryId = '1';
      const updateCategoryDto: UpdateCategoryDto = { name: 'Drinks' };

      const updatedCategory = new Category();
      updatedCategory.id = 1;
      updatedCategory.name = 'Drinks';

      const expectedResponse = new CategoryResponseDto();
      expectedResponse.id = 1;
      expectedResponse.name = 'Drinks';

      service.updateCategory.mockResolvedValue(updatedCategory);

      const result = await controller.update(categoryId, updateCategoryDto);

      expect(service.updateCategory).toHaveBeenCalledWith(
        +categoryId,
        updateCategoryDto,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const categoryId = '1';

      service.removeCategory.mockResolvedValue(undefined);

      await controller.remove(categoryId);

      expect(service.removeCategory).toHaveBeenCalledWith(+categoryId);
    });
  });
});
