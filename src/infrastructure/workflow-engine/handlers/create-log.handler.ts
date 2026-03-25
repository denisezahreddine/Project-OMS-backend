import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class CreateLogHandler implements ActionHandler {
  private readonly logger = new Logger(CreateLogHandler.name);

  execute(context: ActionContext): Promise<void> {
    this.logger.log(
      `Log cree — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return Promise.resolve();
  }
}
