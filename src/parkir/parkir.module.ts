import { Module } from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { ParkirController } from './parkir.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParkirController],
  providers: [ParkirService],
})
export class ParkirModule {}
