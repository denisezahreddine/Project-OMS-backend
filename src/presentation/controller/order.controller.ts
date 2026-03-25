import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../domain/usecases/order.usecases';
import { CreateOrderDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/orders')
export class OrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  // POST /orders
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
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
