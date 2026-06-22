import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger, NotFoundException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    this.logger.log(`Creating category with name ${createCategoryDto.name}`);
    if (
      await this.findCategoryByName(
        createCategoryDto.name.toLowerCase(),
        userId,
      )
    ) {
      this.logger.warn(
        `Category with name ${createCategoryDto.name} already exists`,
      );
      throw new ConflictException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }
    const newCategore = this.categoryRepository.create({
      name: createCategoryDto.name.toLowerCase(),
      user: { id: userId },
    });
    return await this.categoryRepository.save(newCategore);
  }

  async findAllCategoriesByUserId(userId: number): Promise<Category[]> {
    this.logger.log(`Fetching categories for user with id ${userId}`);
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOneCategory(id: number): Promise<Category> {
    this.logger.log(`Fetching category with id ${id}`);
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.logger.log(`Updating category with id ${id}`);
    const existingCategory = await this.findOneCategory(id);
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    if (updateCategoryDto.name?.toLocaleLowerCase() !== undefined) {
      existingCategory.name = updateCategoryDto.name;
    }
    return await this.categoryRepository.save(existingCategory);
  }

  async removeCategory(id: number): Promise<void> {
    this.logger.log(`Removing category with id ${id}`);
    await this.categoryRepository.delete(id);
  }

  async findCategoryByName(
    name: string,
    userId: number,
  ): Promise<Category | null> {
    this.logger.log(
      `Fetching category with name ${name} and user id ${userId}`,
    );
    return await this.categoryRepository.findOne({
      where: { name, user: { id: userId } },
    });
  }
}
