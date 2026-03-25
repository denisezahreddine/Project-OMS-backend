// src/order.module.ts
import {Module} from "@nestjs/common";
import {PrismaService} from "../infrastructure/database/prisma.service";
import {AuthController} from "../presentation/auth.controller";
import {RegisterUseCase} from "../application/usecases/register.usecase";
import {MerchantRepository} from "../domain/repositories/merchant.repository";
import {MerchantRepositoryImpl} from "../infrastructure/repository/merchant.repository";
import {OrderController} from "../presentation/order.controller";
import {CreateOrderUseCase} from "../application/usecases/order.usecases";
import {OrderRepositoryImpl} from "../infrastructure/repository/order.repository";
import {IOrderRepository} from "../domain/repositories/order.repository";
import {EmailNotifierAdapter} from "../infrastructure/adapters/email.notifier";
import {EmailNotifier} from "../domain/repositories/email.notifier";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";

@Module({
    imports: [InfrastructureModule],
    exports: [InfrastructureModule],
})
export class DomainModule {}