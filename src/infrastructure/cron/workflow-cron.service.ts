import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowRepository } from '../../domain/ports/workflow.repository';

@Injectable()
export class WorkflowCronService {
  private readonly logger = new Logger(WorkflowCronService.name);

  constructor(
    private readonly workflowRepo: WorkflowRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // S'execute toutes les minutes
  @Cron('0 * * * * *')
  async handleScheduledWorkflows(): Promise<void> {
    this.logger.log('Cron: verification des workflows planifies...');

    // Trouve tous les workflows actifs avec trigger manual.trigger
    const workflows = await this.workflowRepo.findByTrigger('manual.trigger');

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
  }
}