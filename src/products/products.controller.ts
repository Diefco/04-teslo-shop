import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Product } from './entities';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 401,
    description: 'Unathorized, provide the user token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User without the required permissions',
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of all productos with pagination',
    type: [Product],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(
    @Param('term')
    term: string,
  ) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Product was updated',
    type: Product,
  })
  @ApiResponse({
    status: 401,
    description: 'Unathorized, provide the user token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User without the required permissions',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Product was removed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unathorized, provide the user token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User without the required permissions',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.productsService.remove(id);
  }
}
