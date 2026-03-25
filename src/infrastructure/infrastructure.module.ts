import { Module } from '@nestjs/common';
import { MerchantPort } from '../domain/ports/merchant.port';
import { MerchantRepositoryImpl } from './adapters/merchant.repository';
import { IOrderRepository } from '../domain/ports/order.repository';
import { OrderRepositoryImpl } from './adapters/order.repository';
import { EmailNotifier } from '../domain/ports/email.notifier';
import { EmailNotifierAdapter } from './adapters/email.notifier';
import { PrismaService } from './database/prisma.service';
import { WorkflowEngineUsecase } from '../domain/usecases/workflow-engine.usecase';
import { WorkflowRepository } from '../domain/ports/workflow.repository';
import { PrismaWorkflowRepository } from './adapters/workflow.repository';
import { NotifyAdminHandler } from './workflow-engine/handlers/notify-admin.handler';
import { CreateTaskHandler } from './workflow-engine/handlers/create-task.handler';
import { ActionFactory } from './workflow-engine/action-factory.service';
import { WorkflowListener } from './workflow-engine/workflow.listener';
import { CreateLogHandler } from './workflow-engine/handlers/create-log.handler';
import { NotifyUserHandler } from './workflow-engine/handlers/notify-user.handler';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: MerchantPort,
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
    {
      provide: WorkflowRepository,
      useClass: PrismaWorkflowRepository,
    },
    // Workflow engine (port → implémentation)
    WorkflowEngineUsecase,
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    // Factory
    ActionFactory,
    // Listener d'événements
    WorkflowListener,
  ],
  exports: [
    MerchantPort,
    IOrderRepository,
    EmailNotifier,
    WorkflowRepository,
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    ActionFactory,
    WorkflowListener,
  ],
})
export class InfrastructureModule {}
