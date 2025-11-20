import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { FindParkirDto } from './dto/find-parkir.dto';
import { jenisKendaraan } from '@prisma/client';

@Injectable()
export class ParkirService {
  constructor(private prisma: PrismaService) {}

  private tarif(jenis: 'RODA2' | 'RODA4'){
    if (jenis === 'RODA2') return {
      first: 3000,
      next: 2000
    };
    return {
      first: 6000,
      next: 4000
    };
  }

  private calcTotal(jenis: 'RODA2' | 'RODA4', durasi: number): BigInt {
    const tarif =  this.tarif(jenis);
    if (durasi <= 1) return BigInt(tarif.first);
    const total = tarif.first + (durasi - 1)*tarif.next;
    return BigInt(total);
  }

  async create(createParkirDto: CreateParkirDto) {
    const total = this.calcTotal(createParkirDto.jenisKendaraan, createParkirDto.durasi);
    const created = await this.prisma.parkir.create({
      data: {
        platNomor: createParkirDto.platNomor.trim(),
        jenisKendaraan: createParkirDto.jenisKendaraan,
        durasi: createParkirDto.durasi,
        total: Number(total)
      },
    });
    return created;
  }

 async findAll(query: FindParkirDto) {
  const {
    page = 1,
    limit = 10,
    search,
    jenisKendaraan,
    durasi,
  } = query;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.parkir.findMany({
      where: {OR: [
        {platNomor: { contains: search || ''} },
        {jenisKendaraan: { equals: jenisKendaraan || undefined } },
        {durasi: { equals: durasi || undefined } },
      ]},
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.parkir.aggregate({ where: {OR: [
        {platNomor: { contains: search || ''} },
        {jenisKendaraan: { equals: jenisKendaraan || undefined } },
        {durasi: { equals: durasi || undefined } },
      ]}, _sum: {total: true} }).then(res => res._sum.total ?? Number(0)),
  ]);

  console.log(data);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}


  async findOne(id: number) {
    const p = await this.prisma.parkir.findUnique({ where: { id }});
    if (!p) throw new NotFoundException(`Parkir dengan id ${id} tidak ditemukan`);
    return p;
  }

  async getTotalPendapatan() {
    const result = await this.prisma.parkir.aggregate({
      _sum: {
        total: true,
      }
    });
    return { totalPendapatan: result._sum.total ? result._sum.total : BigInt(0) };
  }

  async update(id: number, dto: UpdateParkirDto) {
    const exist = await this.prisma.parkir.findUnique({ where: { id }});
    if (!exist) throw new NotFoundException(`Parkir dengan id ${id} tidak ditemukan`);
    let data: any = {};
    if (dto.durasi) {
      const total = this.calcTotal(exist.jenisKendaraan as 'RODA2' | 'RODA4', dto.durasi);
      data.durasi = dto.durasi;
      data.total = Number(total);
    }
    const updated = await this.prisma.parkir.update({
      where: { id },
      data
    });
    return updated;
  }

  async remove(id: number) {
    const exist = await this.prisma.parkir.findUnique({ where: { id }});
    if (!exist) throw new NotFoundException(`Parkir dengan id ${id} tidak ditemukan`);
    await this.prisma.parkir.delete({ where: { id }});
    return { deleted: true };
  }
}
