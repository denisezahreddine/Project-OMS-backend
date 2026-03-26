// src/infrastructure/repositories/prisma-order.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IOrderRepository } from '../../domain/ports/order.repository';
import {
  OrderEntity,
  OrderItem,
  OrderStatus,
} from '../../domain/models/order.entity';
import { MerchantEntity, Role } from '../../domain/models/merchant.entity';

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  private toOrderEntity(prismaOrder: {
    id: string;
    merchantId: string;
    customerEmail: string;
    status: string;
    createdAt: Date;
    items: Array<{ productId: string; quantity: number; price: number }>;
  }): OrderEntity {
    return OrderEntity.create(
      prismaOrder.id,
      prismaOrder.merchantId,
      prismaOrder.customerEmail,
      prismaOrder.items.map(
        (i) => new OrderItem(i.productId, i.quantity, i.price),
      ),
      (prismaOrder.status as OrderStatus) || OrderStatus.PENDING,
      prismaOrder.createdAt,
    );
  }

  async save(data: OrderEntity): Promise<OrderEntity> {
    const prismaOrder = await this.prisma.order.create({
      data: {
        merchantId: data.merchantId,
        customerEmail: data.customerEmail,
        totalAmount: data.totalAmount,
        status: data.status,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      // IMPORTANT : On doit inclure les items pour que l'objet retourné soit complet
      include: { items: true },
    });

    return this.toOrderEntity(prismaOrder);
  }

  async findById(orderId: string): Promise<OrderEntity | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!prismaOrder) {
      return null;
    }

    return this.toOrderEntity(prismaOrder);
  }

  async updateStatus(orderId: string, nextStatus: OrderStatus): Promise<OrderEntity> {
    const prismaOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: { items: true },
    });

    return this.toOrderEntity(prismaOrder);
  }

  async findMerchantEmail(merchantId: string): Promise<MerchantEntity | null> {
    const prismaRecord = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });
    if (!prismaRecord) {
      return null;
    }
    return MerchantEntity.create(
      prismaRecord.id,
      prismaRecord.name,
      prismaRecord.email,
      prismaRecord.password,
      prismaRecord.role as Role,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
    );
  }
}
