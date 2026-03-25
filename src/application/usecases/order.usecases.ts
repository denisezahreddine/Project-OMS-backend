import {OrderRepositoryImpl} from "../../infrastructure/repository/order.repository";
import {Injectable} from "@nestjs/common";
import {IOrderRepository} from "../../domain/repositories/order.repository";
import {CreateOrderDto} from "../../presentation/dto/order.dto";
import {EmailNotifier} from "../../domain/repositories/email.notifier";
import {OrderEntity, OrderItem, OrderStatus} from "../../domain/models/order.entity";
@Injectable()
export class CreateOrderUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository, // Un autre Port
        private readonly emailNotifier: EmailNotifier,     // Le Port défini plus haut
    ) {}

    async execute(data: CreateOrderDto) {

      const orderEntity = OrderEntity.create(crypto.randomUUID(),data.merchantId,data.customerEmail,
          data.items.map(i =>
          new OrderItem(i.productId, i.quantity, i.price)), OrderStatus.PENDING,new Date());

        const order = await this.orderRepository.save(orderEntity);
        const merchant = await this.orderRepository.findMerchantEmail(data.merchantId);

        await this.emailNotifier.sendOrderNotification(merchant?.email || '', data.merchantId);
        return order;
    }
}