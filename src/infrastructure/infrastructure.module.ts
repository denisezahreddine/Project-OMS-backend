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

// infrastructure.module.ts
@Module({
    providers: [
        PrismaService,
        // On lie l'interface (IOrderRepository) à l'implémentation ici
        {
            provide: MerchantRepository,
            useClass: MerchantRepositoryImpl
        },
        {
            provide: IOrderRepository,
            useClass: OrderRepositoryImpl
        },
        {
            provide: EmailNotifier,
            useClass: EmailNotifierAdapter
        },
    ],
    exports: [MerchantRepository,IOrderRepository, EmailNotifier, PrismaService],
})
export class InfrastructureModule {}