import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CreateWorkflowUseCase } from '../../domain/usecases/create-workflow.usecase';
import { AddActionToWorkflowUseCase } from '../../domain/usecases/add-action-to-workflow.usecase';
import { FindWorkflowExecutionsUseCase } from '../../domain/usecases/find-workflow-executions.usecase';
import { ListMerchantWorkflowsUseCase } from '../../domain/usecases/list-merchant-workflows.usecase';
import { WorkflowDto } from '../dto/workflow.dto';
import { AddActionDto } from '../dto/add-action.dto';
import {WorkflowEngineUsecase} from "../../domain/usecases/workflow-engine.usecase";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {ApiBearerAuth} from "@nestjs/swagger";

@ApiBearerAuth('access-token') // <--- TRÈS IMPORTANT : Doit correspondre au nom dans main.ts
@UseGuards(JwtAuthGuard)
@Controller('workflows')
export class WorkflowController {
  constructor(
    private createWorkflow: CreateWorkflowUseCase,
    private addAction: AddActionToWorkflowUseCase,
    private triggerManual: WorkflowEngineUsecase,
    private findExecutions: FindWorkflowExecutionsUseCase,
    private listWorkflows: ListMerchantWorkflowsUseCase,
  ) {}

  // POST /workflows
  @Post()
  async create(@Body() dto: WorkflowDto, @Request() req) {
    return this.createWorkflow.execute(dto.name, dto.trigger, req.user.id);
  }
  // POST /workflows/:id/actions
  @Post(':id/actions')
  async addActionToWorkflow(@Param('id') id: string, @Body() dto: AddActionDto) {
    return this.addAction.execute(id, dto.type, dto.order, dto.config);
  }

  // POST /workflows/:id/trigger
  @Post(':id/trigger')
  async triggerManually(@Request() req) {
    await this.triggerManual.dispatch('manual.trigger',req.user.id,null);
    return { message: 'Workflow declenche manuellement' };
  }

  // GET /workflows/:id/executions
  @Get(':id/executions')
  async getExecutions(@Param('id') id: string) {
    return this.findExecutions.execute(id);
  }

  // GET /workflows
  @Get()
  async findAll(@Request() req) {
    return this.listWorkflows.execute(req.user.id);
  }
}
