import {Module} from '@nestjs/common';
import {RegisterUseCase} from "../domain/usecases/register.usecase";
import {CreateOrderUseCase} from "../domain/usecases/order.usecases";
import {InfrastructureModule} from "../infrastructure/infrastructure.module";
import {WorkflowEngineService} from "../infrastructure/workflow-engine/workflow-engine.service";
import {CreateWorkflowUseCase} from "./usecases/create-workflow.usecase";
import {AddActionToWorkflowUseCase} from "./usecases/add-action-to-workflow.usecase";
import {TriggerManualWorkflowUseCase} from "./usecases/trigger-manual-workflow.usecase";
import {FindWorkflowExecutionsUseCase} from "./usecases/find-workflow-executions.usecase";
import {ListMerchantWorkflowsUseCase} from "./usecases/list-merchant-workflows.usecase";


@Module({
    imports: [InfrastructureModule],
    providers: [
        RegisterUseCase,
        CreateOrderUseCase,
        WorkflowEngineService,
        CreateWorkflowUseCase,
        AddActionToWorkflowUseCase,
        TriggerManualWorkflowUseCase,
        FindWorkflowExecutionsUseCase,
        ListMerchantWorkflowsUseCase,
    ],
    exports: [
        RegisterUseCase,
        CreateOrderUseCase,
        CreateWorkflowUseCase,
        AddActionToWorkflowUseCase,
        TriggerManualWorkflowUseCase,
        FindWorkflowExecutionsUseCase,
        ListMerchantWorkflowsUseCase,
    ],
})
export class DomainModule {
}