import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class CreateLogHandler implements ActionHandler {
  private readonly logger = new Logger(CreateLogHandler.name);

  execute(context: ActionContext): Promise<void> {
    const data = context.eventData as Record<string, unknown>;
    const merchantId = context.merchantId ?? data?.merchantId;
    this.logger.log(
      `Log cree — merchant: ${merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return Promise.resolve();
  }
}
