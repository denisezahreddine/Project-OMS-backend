import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CreateWorkflowUseCase } from '../../domain/usecases/create-workflow.usecase';
import { AddActionToWorkflowUseCase } from '../../domain/usecases/add-action-to-workflow.usecase';
import { FindWorkflowExecutionsUseCase } from '../../domain/usecases/find-workflow-executions.usecase';
import { ListMerchantWorkflowsUseCase } from '../../domain/usecases/list-merchant-workflows.usecase';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { AddActionDto } from '../dto/add-action.dto';
import {WorkflowEngineUsecase} from "../../domain/usecases/workflow-engine.usecase";

@Controller('workflows')
export class WorkflowController {
  constructor(
    private createWorkflow: CreateWorkflowUseCase,
    private addAction: AddActionToWorkflowUseCase,
    private triggerManual: WorkflowEngineUsecase,
    private findExecutions: FindWorkflowExecutionsUseCase,
    private listWorkflows: ListMerchantWorkflowsUseCase
  ) {}

  // POST /workflows
  @Post()
  async create(@Body() dto: CreateWorkflowDto) {
    // TODO: récupérer merchantId depuis le token auth
    const merchantId = '69c448b06dd35d96848f532c';
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
    const merchantId = '69c3e2e095ecf7392c41d2a3';
    await this.triggerManual.dispatch('manual.trigger',merchantId,null);
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
    const merchantId = '69c3e2e095ecf7392c41d2a3';
    return this.listWorkflows.execute(merchantId);
  }
}
