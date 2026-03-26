export abstract class WorkflowEnginePort {
  abstract dispatch(
    trigger: string,
    merchantId: string | undefined,
    eventData: unknown,
  ): Promise<void>;
}
