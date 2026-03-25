// src/order.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { OrderController } from './controller/order.controller';
import { WorkflowController } from './controller/workflow.controller';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule], // Importe les Use Cases
  controllers: [AuthController, OrderController, WorkflowController],
})
export class PresentationModule {}
