import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/usecases/order.usecases';
import { CreateOrderDto } from '../dto/order.dto';

@Controller('/orders')
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.createOrderUseCase.execute(createOrderDto);

      return {
        message: 'Order created successfully and merchant notified',
        orderId: result.id,
        total: result.totalAmount,
      };
    } catch (error) {
      // Tu peux affiner la gestion d'erreur selon le type d'exception métier
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
