import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { WorkflowRepository } from '../ports/workflow.repository';

@Injectable()
export class ToggleWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string, userId: string): Promise<{ isActive: boolean }> {
    const workflow = await this.workflowRepo.findById(id);
    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} introuvable`);
    }
    if (workflow.merchantId !== userId) {
      throw new ForbiddenException('Ce workflow ne vous appartient pas');
    }
    const updated = await this.workflowRepo.updateIsActive(id, !workflow.isActive);
    return { isActive: updated.isActive };
  }
}
