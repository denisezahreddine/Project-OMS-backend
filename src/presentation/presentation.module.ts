// src/order.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { OrderController } from './controller/order.controller';
import { WorkflowController } from './controller/workflow.controller';
import { TaskController } from './controller/task.controller';
import { DomainModule } from '../domain/domain.module';
import {WorkflowListener} from "./workflow.listener";

@Module({
  imports: [DomainModule],
  providers: [WorkflowListener],
  controllers: [AuthController, OrderController, WorkflowController, TaskController],
})
export class PresentationModule {}
