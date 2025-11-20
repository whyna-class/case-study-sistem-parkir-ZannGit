import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsEnum, IsDateString } from 'class-validator';

export enum JenisKendaraanEnum {
  RODA2 = 'RODA2',
  RODA4 = 'RODA4',
}

export class FindParkirDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // Search
  @IsOptional()
  @IsString()
  search?: string;

  // Filter jenis kendaraan
  @IsOptional()
  @IsEnum(JenisKendaraanEnum)
  jenisKendaraan?: JenisKendaraanEnum;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durasi?: number;
}
