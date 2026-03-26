import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../ports/order.repository';
import { OrderEntity, OrderStatus } from '../models/order.entity';
import { CustomErrorException } from '../exceptions/custom.error.exceptions';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(orderId: string, nextStatus: OrderStatus): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new CustomErrorException('Order not found');
    }

    if (order.status === nextStatus) {
      throw new CustomErrorException('Order already has this status');
    }

    if (!this.isValidTransition(order.status, nextStatus)) {
      throw new CustomErrorException(
        `Invalid status transition from ${order.status} to ${nextStatus}`,
      );
    }

    const updatedOrder = await this.orderRepository.updateStatus(orderId, nextStatus);

    this.eventEmitter.emit('updated.status', {
      orderId: updatedOrder.id,
      merchantId: updatedOrder.merchantId,
      previousStatus: order.status,
      newStatus: updatedOrder.status,
    });

    return updatedOrder;
  }

  private isValidTransition(
    current: OrderStatus,
    next: OrderStatus,
  ): boolean {
    if (current === OrderStatus.PENDING) {
      return next === OrderStatus.PAID || next === OrderStatus.CANCELLED;
    }

    if (current === OrderStatus.PAID) {
      return next === OrderStatus.SHIPPED;
    }

    return false;
  }
}