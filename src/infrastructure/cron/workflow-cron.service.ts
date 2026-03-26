import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowRepository } from '../../domain/ports/workflow.repository';
import { IOrderRepository } from '../../domain/ports/order.repository';
import { OrderStatus } from '../../domain/models/order.entity';

@Injectable()
export class WorkflowCronService {
  private readonly logger = new Logger(WorkflowCronService.name);

  constructor(
    private readonly workflowRepo: WorkflowRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // S'execute toutes les 5 minutes
  @Cron('0 * * * * *')
  async handleScheduledWorkflows(): Promise<void> {
    this.logger.log('Cron: verification des workflows planifies...');

    // Trouve tous les workflows actifs avec trigger order.notpaid
    const workflows = await this.workflowRepo.findByTrigger('order.notpaid');

    if (workflows.length === 0) {
      this.logger.log('Cron: aucun workflow planifie actif');
      return;
    }

    this.logger.log(
      `Cron: ${workflows.length} workflow(s) planifie(s) a declencher`,
    );

    // Declenche chaque workflow via EventEmitter — comportement tracable
    for (const workflow of workflows) {
      this.logger.log(`Cron: declenchement workflow "${workflow.name}"`);
      this.eventEmitter.emit('manual.trigger', {
        merchantId: workflow.merchantId,
        source: 'cron',
        workflowId: workflow.id,
      });
    }

    const pendingOrders = await this.orderRepository.findByStatus(
      OrderStatus.PENDING,
    );

    if (pendingOrders.length === 0) {
      this.logger.log(
        'Cron: aucune commande pending a traiter pour order.notpaid',
      );
      return;
    }

    this.logger.log(
      `Cron: ${pendingOrders.length} commande(s) pending, emission de order.notpaid`,
    );

    for (const order of pendingOrders) {
      this.eventEmitter.emit('order.notpaid', {
        merchantId: order.merchantId,
        orderId: order.id,
        status: order.status,
        customerEmail: order.customerEmail,
      });
    }
  }
}