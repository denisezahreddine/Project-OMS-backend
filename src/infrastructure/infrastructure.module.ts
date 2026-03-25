import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MerchantPort } from '../domain/ports/merchant.port';
import { MerchantRepositoryImpl } from './adapters/merchant.repository';
import { IOrderRepository } from '../domain/ports/order.repository';
import { OrderRepositoryImpl } from './adapters/order.repository';
import { EmailNotifier } from '../domain/ports/email.notifier';
import { EmailNotifierAdapter } from './adapters/email.notifier';
import { PrismaService } from './database/prisma.service';
import { WorkflowEngineService } from './workflow-engine/workflow-engine.service';
import { WorkflowRepository } from '../domain/ports/workflow.repository';
import { PrismaWorkflowRepository } from './adapters/workflow.repository';
import { WorkflowEnginePort } from '../domain/ports/workflow-engine.port';
import { NotifyAdminHandler } from './workflow-engine/handlers/notify-admin.handler';
import { CreateTaskHandler } from './workflow-engine/handlers/create-task.handler';
import { ActionFactory } from './workflow-engine/action-factory.service';
import { WorkflowListener } from './workflow-engine/workflow.listener';
import { CreateLogHandler } from './workflow-engine/handlers/create-log.handler';
import { NotifyUserHandler } from './workflow-engine/handlers/notify-user.handler';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'super-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
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
    WorkflowEngineService,
    {
      provide: WorkflowEnginePort,
      useExisting: WorkflowEngineService,
    },
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    // Factory
    ActionFactory,
    // Listener d'événements
    WorkflowListener,
    JwtStrategy,
  ],
  exports: [
    JwtModule,
    MerchantPort,
    IOrderRepository,
    EmailNotifier,
    WorkflowRepository,
    WorkflowEnginePort,
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    ActionFactory,
    WorkflowListener,
  ],
})
export class InfrastructureModule {}
