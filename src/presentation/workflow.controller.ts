import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateWorkflowUseCase } from '../application/usecases/create-workflow.usecase';
import { AddActionToWorkflowUseCase } from '../application/usecases/add-action-to-workflow.usecase';
import { TriggerManualWorkflowUseCase } from '../application/usecases/trigger-manual-workflow.usecase';
import { FindWorkflowExecutionsUseCase } from '../application/usecases/find-workflow-executions.usecase';
import { ListMerchantWorkflowsUseCase } from '../application/usecases/list-merchant-workflows.usecase';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { AddActionDto } from './dto/add-action.dto';

@Controller('workflows')
export class WorkflowController {
  constructor(
    private createWorkflow: CreateWorkflowUseCase,
    private addAction: AddActionToWorkflowUseCase,
    private triggerManual: TriggerManualWorkflowUseCase,
    private findExecutions: FindWorkflowExecutionsUseCase,
    private listWorkflows: ListMerchantWorkflowsUseCase,
  ) {}

  // POST /workflows
  @Post()
  async create(@Body() dto: CreateWorkflowDto) {
    // TODO: récupérer merchantId depuis le token auth
    const merchantId = '000000000000000000000001';
    return this.createWorkflow.execute(dto.name, dto.trigger, merchantId);
  }

  // POST /workflows/:id/actions
  @Post(':id/actions')
  async addActionToWorkflow(
    @Param('id') id: string,
    @Body() dto: AddActionDto,
  ) {
    return this.addAction.execute(id, dto.type, dto.order, dto.config);
  }

  // POST /workflows/:id/trigger
  @Post(':id/trigger')
  async triggerManually() {
    const merchantId = '000000000000000000000001';
    await this.triggerManual.execute(merchantId);
    return { message: 'Workflow declenche manuellement' };
  }

  // GET /workflows/:id/executions
  @Get(':id/executions')
  async getExecutions(@Param('id') id: string) {
    return this.findExecutions.execute(id);
  }

  // GET /workflows
  @Get()
  async findAll() {
    const merchantId = '000000000000000000000001';
    return this.listWorkflows.execute(merchantId);
  }
}
