// src/order.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/auth.controller';
import { OrderController } from '../presentation/order.controller';
import { ApplicationModule } from '../application/application.module';
import { WorkflowController } from './workflow.controller';

@Module({
  imports: [ApplicationModule], // Importe les Use Cases
  controllers: [AuthController, OrderController,WorkflowController],
})
export class PresentationModule {}
