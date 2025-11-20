import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsOptional, IsInt, Min } from 'class-validator';

export class UpdateParkirDto extends PartialType(CreateParkirDto) {
    @IsOptional()
    @IsInt()
    @Min(1)
    durasi?: number;
}
