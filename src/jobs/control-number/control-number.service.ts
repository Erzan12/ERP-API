import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';

type Db = PrismaClient | Prisma.TransactionClient;

@Injectable()
export class ControlNumberService {
  constructor(private readonly prisma: PrismaService) {}

  async getNextNumber(
    companyId: string,
    sequenceKey: string,
    year: number,
    db: Db = this.prisma,
  ): Promise<number> {
    const sequence = await db.sequenceCounter.upsert({
      where: {
        company_id_sequence_key_year: {
          company_id: companyId,
          sequence_key: sequenceKey,
          year,
        },
      },
      create: {
        company_id: companyId,
        sequence_key: sequenceKey,
        year,
        last_number: 1,
      },
      update: {
        last_number: {
          increment: 1,
        },
      },
    });

    return sequence.last_number;
  }
}