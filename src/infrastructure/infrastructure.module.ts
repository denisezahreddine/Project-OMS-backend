import { Module } from '@nestjs/common';
import { PrismaModule } from '../modules/prisma.module';
import { MerchantRepository } from '../domain/ports/merchant.repository';
import { MerchantRepositoryImpl } from './adapters/merchant.repository';
import { IOrderRepository } from '../domain/ports/order.repository';
import { OrderRepositoryImpl } from './adapters/order.repository';
import { EmailNotifier } from '../domain/ports/email.notifier';
import { EmailNotifierAdapter } from '../infrastructure/adapters/email.notifier';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: MerchantRepository,
      useClass: MerchantRepositoryImpl,
    },
    {
      provide: IOrderRepository,
      useClass: OrderRepositoryImpl,
    },
    {
      provide: EmailNotifier,
      useClass: EmailNotifierAdapter,
    },
  ],
  exports: [MerchantRepository, IOrderRepository, EmailNotifier],
})
export class InfrastructureModule {}
