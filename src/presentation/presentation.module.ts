// src/order.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { OrderController } from './controller/order.controller';
import { ApplicationModule } from '../application/application.module';
import { WorkflowController } from './controller/workflow.controller';

@Module({
  imports: [ApplicationModule], // Importe les Use Cases
  controllers: [AuthController, OrderController,WorkflowController],
})
export class PresentationModule {}
