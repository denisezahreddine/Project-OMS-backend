import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/ports/order.repository';
import { CreateOrderDto } from '../../presentation/dto/order.dto';
import { EmailNotifier } from '../../domain/ports/email.notifier';
import {
  OrderEntity,
  OrderItem,
  OrderStatus,
} from '../../domain/models/order.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository, // Un autre Port
    private readonly emailNotifier: EmailNotifier, // Le Port défini plus haut
    private readonly eventEmitter: EventEmitter2, //That's pour emettre our event go
  ) {}

  async execute(data: CreateOrderDto) {
    const orderEntity = OrderEntity.create(
      randomUUID(),
      data.merchantId,
      data.customerEmail,
      data.items.map((i) => new OrderItem(i.productId, i.quantity, i.price)),
      OrderStatus.PENDING,
      new Date(),
    );

    const order = await this.orderRepository.save(orderEntity);
    const merchant = await this.orderRepository.findMerchantEmail(
      data.merchantId,
    );

    await this.emailNotifier.sendOrderNotification(
      merchant?.email || '',
      order.id ?? '',
    );
    //Emettre notre evenement de creation de order
    this.eventEmitter.emit('order.created', {
      merchantId: data.merchantId,
      orderId: order.id,
    });
    return order;
  }
}
