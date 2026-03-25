import { Module } from '@nestjs/common';
import { RegisterUseCase } from '../application/usecases/register.usecase';
import { CreateOrderUseCase } from './usecases/order.usecases';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [RegisterUseCase, CreateOrderUseCase],
  exports: [RegisterUseCase, CreateOrderUseCase],
})
export class ApplicationModule {}
