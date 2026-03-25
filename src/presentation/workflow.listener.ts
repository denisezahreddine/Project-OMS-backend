import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WorkflowEngineUsecase } from '../domain/usecases/workflow-engine.usecase';

@Injectable()
export class WorkflowListener {
  private readonly logger = new Logger(WorkflowListener.name);

  constructor(private engine: WorkflowEngineUsecase) {}

  @OnEvent('user.registered')
  async handleUserRegistered(data: { merchantId: string; email: string }) {
    this.logger.log(`Event recu: user.registered pour ${data.email}`);
    await this.engine.dispatch('user.registered', data.merchantId, data);
  }

  @OnEvent('order.created')
  async handleOrderCreated(data: { merchantId: string; orderId: string }) {
    this.logger.log(`Event recu: order.created`);
    await this.engine.dispatch('order.created', data.merchantId, data);
  }

  @OnEvent('manual.trigger')
  async handleManualTrigger(data: { merchantId: string }) {
    this.logger.log(`Event recu: manual.trigger`);
    await this.engine.dispatch('manual.trigger', data.merchantId, data);
  }
}
