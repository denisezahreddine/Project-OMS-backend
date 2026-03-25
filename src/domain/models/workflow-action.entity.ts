export class WorkflowActionEntity {
  constructor(
    public readonly id: string,
    public readonly workflowId: string,
    public readonly type: string,
    public readonly order: number,
    public readonly config?: any,
  ) {}

  static create(
    id: string,
    workflowId: string,
    type: string,
    order: number,
    config?: any,
  ): WorkflowActionEntity {
    return new WorkflowActionEntity(id, workflowId, type, order, config);
  }
}
