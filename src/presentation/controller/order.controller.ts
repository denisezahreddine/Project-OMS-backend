import {
  Controller,
  Post,
  Body,
  UseGuards,
  InternalServerErrorException,
  Request,
  Param,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../domain/usecases/order.usecases';
import { ChangeOrderStatusUseCase } from '../../domain/usecases/change-order-status.usecase';
import { ChangeOrderStatusDto, CreateOrderDto } from '../dto/order.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase,
  ) {}

  // POST /orders
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req: { user: { merchantId: string } }) {
    try {
      createOrderDto.merchantId = req.user.merchantId;
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

  @Post(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: ChangeOrderStatusDto,
  ) {
    const result = await this.changeOrderStatusUseCase.execute(id, dto.status);
    return {
      message: 'Order status updated successfully',
      orderId: result.id,
      status: result.status,
    };
  }
}
