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
import { WorkflowEngineUsecase } from '../domain/usecases/workflow-engine.usecase';
import { WorkflowRepository } from '../domain/ports/workflow.repository';
import { PrismaWorkflowRepository } from './adapters/workflow.repository';
import { TaskRepository } from '../domain/ports/task.repository';
import { PrismaTaskRepository } from './adapters/task.repository';
import { NotifyAdminHandler } from './workflow-engine/handlers/notify-admin.handler';
import { CreateTaskHandler } from './workflow-engine/handlers/create-task.handler';
import { ScheduleModule } from '@nestjs/schedule';
import { WorkflowCronService } from './cron/workflow-cron.service';
import { ActionFactory } from './workflow-engine/action-factory.service';
import { WorkflowListener } from '../presentation/workflow.listener';
import { CreateLogHandler } from './workflow-engine/handlers/create-log.handler';
import { NotifyUserHandler } from './workflow-engine/handlers/notify-user.handler';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ScheduleModule.forRoot(), //this is pour our cron
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
    {
      provide: TaskRepository,
      useClass: PrismaTaskRepository,
    },
    // Workflow engine (port → implémentation)
    WorkflowEngineUsecase,
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    // Factory
    ActionFactory,
    JwtStrategy,
    WorkflowCronService,
  ],
  exports: [
    JwtModule,
    MerchantPort,
    IOrderRepository,
    EmailNotifier,
    WorkflowRepository,
    TaskRepository,
    NotifyAdminHandler,
    NotifyUserHandler,
    CreateLogHandler,
    CreateTaskHandler,
    ActionFactory,
    WorkflowEngineUsecase,
  ],
})
export class InfrastructureModule {}
