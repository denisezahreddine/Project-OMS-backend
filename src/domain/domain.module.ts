import {Module} from '@nestjs/common';
import {RegisterUseCase} from "../domain/usecases/register.usecase";
import {CreateOrderUseCase} from "../domain/usecases/order.usecases";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";
import {WorkflowEngineUsecase} from "./usecases/workflow-engine.usecase";
import {CreateWorkflowUseCase} from "./usecases/create-workflow.usecase";
import {AddActionToWorkflowUseCase} from "./usecases/add-action-to-workflow.usecase";
import {FindWorkflowExecutionsUseCase} from "./usecases/find-workflow-executions.usecase";
import {ListMerchantWorkflowsUseCase} from "./usecases/list-merchant-workflows.usecase";


@Module({
    imports: [InfrastructureModule],
    providers: [
        RegisterUseCase,
        CreateOrderUseCase,
        WorkflowEngineUsecase,
        CreateWorkflowUseCase,
        AddActionToWorkflowUseCase,
        FindWorkflowExecutionsUseCase,
        ListMerchantWorkflowsUseCase,
    ],
    exports: [
        RegisterUseCase,
        CreateOrderUseCase,
        CreateWorkflowUseCase,
        WorkflowEngineUsecase,
        AddActionToWorkflowUseCase,
        FindWorkflowExecutionsUseCase,
        ListMerchantWorkflowsUseCase,
    ],
})
export class DomainModule {
}