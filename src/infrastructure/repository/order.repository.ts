// src/infrastructure/repositories/prisma-order.repository.ts
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../database/prisma.service";
import {IOrderRepository} from "../../domain/repositories/order.repository";
import {OrderEntity, OrderItem, OrderStatus} from "../../domain/models/order.entity";
import {MerchantEntity} from "../../domain/models/merchant.entity";

@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
    constructor(private prisma: PrismaService) {}

    async save(data: OrderEntity): Promise<OrderEntity> {

        const prismaOrder = await this.prisma.order.create({
            data: {
                merchantId: data.merchantId,
                customerEmail: data.customerEmail,
                totalAmount: data.totalAmount,
                status: data.status,
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    }))
                }
            },
            // IMPORTANT : On doit inclure les items pour que l'objet retourné soit complet
            include: { items: true }
        });

        return OrderEntity.create(
            prismaOrder.id,
            prismaOrder.merchantId,
            prismaOrder.customerEmail,
            prismaOrder.items.map(i => new OrderItem(i.productId, i.quantity, i.price)),
            prismaOrder.status as OrderStatus || OrderStatus.PENDING, // Cast pour matcher l'enum
            prismaOrder.createdAt
        );
    }

    async findMerchantEmail(merchantId: string): Promise<MerchantEntity |null > {
        const prismaRecord = await this.prisma.merchant.findUnique({
            where: { id: merchantId }
        });
        if (!prismaRecord) {
            return null;
        }
        return  MerchantEntity.create(
            prismaRecord.id,
            prismaRecord.name,
            prismaRecord.email,
            prismaRecord.password,
            prismaRecord.createdAt,
            prismaRecord.updatedAt
        );
    }
}