import { Body, Controller, Get, Param, ParseIntPipe, Post, Patch, Delete, Query } from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { FindParkirDto } from './dto/find-parkir.dto';

@Controller('parkir')
export class ParkirController {
  constructor(private readonly parkirService: ParkirService) {}

  @Post()
  async create(@Body() createDto: CreateParkirDto) {
    return this.parkirService.create(createDto);
  }

  @Get()
  findAll(@Query() query: FindParkirDto) {
  return this.parkirService.findAll(query);
  }


  @Get('total')
  async total() {
    return this.parkirService.getTotalPendapatan();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkirService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateParkirDto) {
    return this.parkirService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkirService.remove(id);
  }
}
