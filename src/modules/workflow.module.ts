import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { WorkflowController } from '../presentation/workflow.controller';
import { CreateWorkflowUseCase } from '../application/usecases/create-workflow.usecase';
import { AddActionToWorkflowUseCase } from '../application/usecases/add-action-to-workflow.usecase';
import { TriggerManualWorkflowUseCase } from '../application/usecases/trigger-manual-workflow.usecase';
import { FindWorkflowExecutionsUseCase } from '../application/usecases/find-workflow-executions.usecase';
import { ListMerchantWorkflowsUseCase } from '../application/usecases/list-merchant-workflows.usecase';
import { WorkflowRepository } from '../domain/ports/workflow.repository';
import { WorkflowEnginePort } from '../domain/ports/workflow-engine.port';
import { PrismaWorkflowRepository } from '../infrastructure/adapters/workflow.repository';
import { NotifyAdminHandler } from '../infrastructure/workflow-engine/handlers/notify-admin.handler';
import { NotifyUserHandler } from '../infrastructure/workflow-engine/handlers/notify-user.handler';
import { CreateLogHandler } from '../infrastructure/workflow-engine/handlers/create-log.handler';
import { CreateTaskHandler } from '../infrastructure/workflow-engine/handlers/create-task.handler';
import { ActionFactory } from '../infrastructure/workflow-engine/action-factory.service';
import { WorkflowEngineService } from '../infrastructure/workflow-engine/workflow-engine.service';
import { WorkflowListener } from '../infrastructure/workflow-engine/workflow.listener';

@Module({
  imports: [PrismaModule],
  controllers: [WorkflowController],
  providers: [
    // Repository (port → adapter)
    {
      provide: WorkflowRepository,
      useClass: PrismaWorkflowRepository,
    },
    // Workflow engine (port → implémentation)
    {
      provide: WorkflowEnginePort,
      useClass: WorkflowEngineService,
    },
    WorkflowEngineService,
    // Use Cases
    CreateWorkflowUseCase,
    AddActionToWorkflowUseCase,
    TriggerManualWorkflowUseCase,
    FindWorkflowExecutionsUseCase,
    ListMerchantWorkflowsUseCase,
    // Strategy Handlers (adaptateurs secondaires)
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    // Factory
    ActionFactory,
    // Listener d'événements
    WorkflowListener,
  ],
})
export class WorkflowModule {}
