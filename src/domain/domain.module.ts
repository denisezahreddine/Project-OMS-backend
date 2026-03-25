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
@Module({
  imports: [InfrastructureModule],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    CreateOrderUseCase,
    WorkflowEngineUsecase,
    CreateWorkflowUseCase,
    AddActionToWorkflowUseCase,

    FindWorkflowExecutionsUseCase,
    ListMerchantWorkflowsUseCase,
  ],
  exports: [
    RegisterUseCase,
    LoginUseCase,
    CreateOrderUseCase,
    CreateWorkflowUseCase,
    WorkflowEngineUsecase,AddActionToWorkflowUseCase,

    FindWorkflowExecutionsUseCase,
    ListMerchantWorkflowsUseCase,
  ],
})
export class DomainModule {}
