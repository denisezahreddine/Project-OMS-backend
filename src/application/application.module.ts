import {Module} from '@nestjs/common';
import {RegisterUseCase} from "../application/usecases/register.usecase";
import {CreateOrderUseCase} from "./usecases/order.usecases";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";
import {DomainModule} from "../domain/domain.module";


@Module({
    imports: [DomainModule], // Pour pouvoir injecter IOrderRepository
    providers: [
        RegisterUseCase,
        CreateOrderUseCase
    ],
    exports: [RegisterUseCase, CreateOrderUseCase],
})
export class ApplicationModule {
}