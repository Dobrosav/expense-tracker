import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Req() request: any,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const userId = request.user.sub;
    const newCategory = await this.categoriesService.createCategory(
      createCategoryDto,
      userId,
    );
    return CreateCategoryDto.fromEntity(newCategory);
  }

  @Get()
  async findAllCategoriesByUserId(
    @Req() request: any,
  ): Promise<CategoryResponseDto[]> {
    const userId = request.user.sub;
    const categories =
      await this.categoriesService.findAllCategoriesByUserId(userId);
    return categories.map(CategoryResponseDto.fromEntity);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const updated = await this.categoriesService.updateCategory(
      +id,
      updateCategoryDto,
    );
    return CategoryResponseDto.fromEntity(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoriesService.removeCategory(+id);
  }
}
