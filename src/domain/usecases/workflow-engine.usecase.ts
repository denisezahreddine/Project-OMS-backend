import { randomUUID } from 'crypto';
import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  WorkflowRepository,
  WorkflowData,
  WorkflowCondition,
} from '../ports/workflow.repository';
import { ActionFactory } from '../../infrastructure/workflow-engine/action-factory.service';
import { ActionContext } from '../ports/action-handler.port';

@Injectable()
export class WorkflowEngineUsecase {
  private readonly logger = new Logger(WorkflowEngineUsecase.name);

  constructor(
    private workflowRepo: WorkflowRepository,
    private actionFactory: ActionFactory,
  ) {}

  async dispatch(
    trigger: string,
    merchantId: string | undefined,
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
      if (workflow.isActive) {
        if (workflow.condition && !this.evaluateCondition(workflow.condition, eventData)) {
          this.logger.log(`Workflow ${workflow.name} ignore: condition non satisfaite`);
          continue;
        }
        await this.executeWorkflow(workflow, {merchantId, eventData});
      }
    }
  }

  async dispatchById(id: string, userId: string): Promise<void> {
    const workflow = await this.workflowRepo.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} introuvable`);
    }
    if (workflow.merchantId !== userId) {
      throw new ForbiddenException('Ce workflow ne vous appartient pas');
    }
    if (!workflow.isActive) {
      throw new ForbiddenException('Ce workflow est désactivé');
    }
    await this.executeWorkflow(workflow, { merchantId: userId, eventData: null });
  }

  private evaluateCondition(condition: WorkflowCondition, eventData: unknown): boolean {
    const data = eventData as Record<string, unknown>;
    const actual = data?.[condition.field];
    const expected = condition.value;

    switch (condition.operator) {
      case '>':   return (actual as number) > (expected as number);
      case '<':   return (actual as number) < (expected as number);
      case '>=':  return (actual as number) >= (expected as number);
      case '<=':  return (actual as number) <= (expected as number);
      case '===': return actual === expected;
      case '!==': return actual !== expected;
      default:    return false;
    }
  }

  private async executeWorkflow(
    workflow: WorkflowData,
    context: ActionContext,
  ): Promise<void> {
    this.logger.log(`[WORKFLOW START] "${workflow.name}" (id: ${workflow.id})`);

    const logs: string[] = [];
    let status = 'success';
    const startTime = Date.now();

    logs.push(
      `[START] Workflow "${workflow.name}" declenche par trigger: ${workflow.trigger}`,
    );
    logs.push(
      `[CONTEXT] merchantId: ${context.merchantId ?? 'platform'} | data: ${JSON.stringify(context.eventData)}`,
    );
    logs.push(`[ACTIONS] ${workflow.actions.length} action(s) a executer`);

    for (const action of workflow.actions) {
      const actionStart = Date.now();
      this.logger.log(
        `[ACTION ${action.order}/${workflow.actions.length}] Execution de "${action.type}"...`,
      );

      try {
        const handler = this.actionFactory.getHandler(action.type);
        const result = await handler.execute(context); // ← récupère le résultat

        const duration = Date.now() - actionStart;

        // Utilise le message retourné par le handler
        const log = `[ACTION ${action.order}] ${action.type}: SUCCESS (${duration}ms) — ${result.message}`;
        logs.push(log);

        this.logger.log(log);
      } catch (error) {
        const duration = Date.now() - actionStart;
        const message = (error as Error).message;
        const log = `[ACTION ${action.order}] ${action.type}: FAILED (${duration}ms) — ${message}`;
        logs.push(log);
        this.logger.error(log);
        status = 'error';
      }
    }

    const totalDuration = Date.now() - startTime;
    const endLog = `[END] Workflow "${workflow.name}" termine en ${totalDuration}ms — status: ${status.toUpperCase()}`;
    logs.push(endLog);
    this.logger.log(endLog);

    await this.workflowRepo.saveExecution({
      id: randomUUID(),
      workflowId: workflow.id,
      status,
      logs,
    });
  }
}
