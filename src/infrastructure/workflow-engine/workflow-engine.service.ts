import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowData,
} from '../../domain/ports/workflow.repository';
import { WorkflowEnginePort } from '../../domain/ports/workflow-engine.port';
import { ActionFactory } from './action-factory.service';
import { ActionContext } from '../../domain/ports/action-handler.port';

@Injectable()
export class WorkflowEngineService implements WorkflowEnginePort {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    private workflowRepo: WorkflowRepository,
    private actionFactory: ActionFactory,
  ) {}

  async dispatch(
    trigger: string,
    merchantId: string,
    eventData: unknown,
  ): Promise<void> {
    this.logger.log(`Evenement recu: ${trigger} pour merchant: ${merchantId}`);

    const workflows = await this.workflowRepo.findByTrigger(
      trigger,
      merchantId,
    );

    if (workflows.length === 0) {
      this.logger.log(`Aucun workflow actif pour: ${trigger}`);
      return;
    }

    this.logger.log(`${workflows.length} workflow(s) a executer`);

    for (const workflow of workflows) {
      await this.executeWorkflow(workflow, { merchantId, eventData });
    }
  }

  private async executeWorkflow(
    workflow: WorkflowData,
    context: ActionContext,
  ): Promise<void> {
    this.logger.log(`Execution workflow: ${workflow.name}`);

    const logs: string[] = [];
    let status = 'success';

    for (const action of workflow.actions) {
      try {
        const handler = this.actionFactory.getHandler(action.type);
        await handler.execute(context);
        logs.push(`${action.type}: OK`);
        this.logger.log(`Action ${action.type}: OK`);
      } catch (error) {
        const message = (error as Error).message;
        logs.push(`${action.type}: ERREUR - ${message}`);
        this.logger.error(`Action ${action.type}: ERREUR - ${message}`);
        status = 'error';
      }
    }

    await this.workflowRepo.saveExecution({
      id: randomUUID(),
      workflowId: workflow.id,
      status,
      logs,
    });

    this.logger.log(`Workflow ${workflow.name} termine: ${status}`);
  }
}
