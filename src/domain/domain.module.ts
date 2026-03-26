import { Module } from '@nestjs/common';
import { RegisterUseCase } from './usecases/register.usecase';
import { LoginUseCase } from './usecases/login.usecase';
import { CreateOrderUseCase } from './usecases/order.usecases';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { CreateWorkflowUseCase } from './usecases/create-workflow.usecase';
import { AddActionToWorkflowUseCase } from './usecases/add-action-to-workflow.usecase';
import { FindWorkflowExecutionsUseCase } from './usecases/find-workflow-executions.usecase';
import { ListMerchantWorkflowsUseCase } from './usecases/list-merchant-workflows.usecase';
import {WorkflowEngineUsecase} from "./usecases/workflow-engine.usecase";
import { ToggleWorkflowUseCase } from './usecases/toggle-workflow.usecase';
import { ChangeOrderStatusUseCase } from './usecases/change-order-status.usecase';
import { GetTasksUseCase } from './usecases/get-tasks.usecase';
@Module({
  imports: [InfrastructureModule],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    CreateOrderUseCase,
    ChangeOrderStatusUseCase,
    WorkflowEngineUsecase,
    CreateWorkflowUseCase,
    AddActionToWorkflowUseCase,
    FindWorkflowExecutionsUseCase,
    ListMerchantWorkflowsUseCase,
    ToggleWorkflowUseCase,
    GetTasksUseCase,
  ],
  exports: [
    RegisterUseCase,
    LoginUseCase,
    CreateOrderUseCase,
    ChangeOrderStatusUseCase,
    CreateWorkflowUseCase,
    WorkflowEngineUsecase,
    AddActionToWorkflowUseCase,
    FindWorkflowExecutionsUseCase,
    ListMerchantWorkflowsUseCase,
    ToggleWorkflowUseCase,
    GetTasksUseCase,
  ],
})
export class DomainModule {}
