import { OrderEntity, OrderStatus } from '../models/order.entity';
import { Injectable } from '@nestjs/common';
import { MerchantEntity } from '../models/merchant.entity';
@Injectable()
export abstract class IOrderRepository {
  abstract save(order: OrderEntity): Promise<OrderEntity>;
  abstract findById(orderId: string): Promise<OrderEntity | null>;
  abstract findByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  abstract updateStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<OrderEntity>;
  abstract findMerchantEmail(
    merchantId: string,
  ): Promise<MerchantEntity | null>;
}
