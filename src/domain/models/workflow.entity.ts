export class WorkflowEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly trigger: string,
    public readonly isActive: boolean,
    public readonly merchantId: string,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    name: string,
    trigger: string,
    merchantId: string,
  ): WorkflowEntity {
    return new WorkflowEntity(id, name, trigger, true, merchantId, new Date());
  }
}
