import { Injectable } from '@nestjs/common';
import { WorkflowEnginePort } from '../../domain/ports/workflow-engine.port';

@Injectable()
export class TriggerManualWorkflowUseCase {
  constructor(private engine: WorkflowEnginePort) {}

  async execute(merchantId: string, eventData?: unknown): Promise<void> {
    await this.engine.dispatch('manual.trigger', merchantId, eventData ?? {});
  }
}
