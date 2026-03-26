import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../ports/order.repository';
import { OrderEntity, OrderStatus } from '../models/order.entity';
import { CustomErrorException } from '../exceptions/custom.error.exceptions';

@Injectable()
export class ChangeOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

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

    return this.orderRepository.updateStatus(orderId, nextStatus);
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