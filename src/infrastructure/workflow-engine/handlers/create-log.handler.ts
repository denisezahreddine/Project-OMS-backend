import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
  ActionResult,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class CreateLogHandler implements ActionHandler {
  private readonly logger = new Logger(CreateLogHandler.name);

  async execute(context: ActionContext): Promise<ActionResult> {
    const data = context.eventData as Record<string, unknown>;
    const merchantId = context.merchantId ?? data?.merchantId;
    this.logger.log(
      `Log cree — merchant: ${merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return {
      success: true,
      message: `Log cree — merchant: ${merchantId} — data: ${JSON.stringify(context.eventData)}`,
    };
  }
}
