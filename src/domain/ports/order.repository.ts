import { OrderEntity } from '../models/order.entity';
import { Injectable } from '@nestjs/common';
import { MerchantEntity } from '../models/merchant.entity';
@Injectable()
export abstract class IOrderRepository {
  abstract save(order: Partial<OrderEntity>): Promise<OrderEntity>;
  abstract findMerchantEmail(
    merchantId: string,
  ): Promise<MerchantEntity | null>;
}
