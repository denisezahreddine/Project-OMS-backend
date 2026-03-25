export abstract class WorkflowEnginePort {
  abstract dispatch(
    trigger: string,
    merchantId: string,
    eventData: unknown,
  ): Promise<void>;
}
