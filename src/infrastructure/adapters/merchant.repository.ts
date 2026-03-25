import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MerchantPort } from '../../domain/ports/merchant.port';
import { MerchantEntity } from '../../domain/models/merchant.entity';

@Injectable()
export class MerchantRepositoryImpl implements MerchantPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<MerchantEntity | null> {
    // 1. On attend la réponse avec "await"
    const prismaRecord = await this.prisma.merchant.findUnique({
      where: { email },
    });

    if (!prismaRecord) return null;

    return MerchantEntity.create(
      prismaRecord.id,
      prismaRecord.name,
      prismaRecord.email,
      prismaRecord.password,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
    );
  }

  async save(user: MerchantEntity): Promise<MerchantEntity> {
    const prismaRecord = await this.prisma.merchant.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.getPassword(),
      },
    });

    return MerchantEntity.create(
      prismaRecord.id,
      prismaRecord.name,
      prismaRecord.email,
      prismaRecord.password,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
    );
  }
}
