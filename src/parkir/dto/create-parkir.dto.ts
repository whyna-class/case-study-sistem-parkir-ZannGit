import { IsNotEmpty, IsIn, IsInt, Min } from "class-validator";

export class CreateParkirDto {
    @IsNotEmpty()
    platNomor: string;

    @IsIn(['RODA2', 'RODA4'])
    jenisKendaraan: 'RODA2' | 'RODA4';

    @IsInt()
    @Min(1)
    durasi: number;
}