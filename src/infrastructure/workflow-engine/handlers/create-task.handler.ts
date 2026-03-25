import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class CreateTaskHandler implements ActionHandler {
  private readonly logger = new Logger(CreateTaskHandler.name);

  execute(context: ActionContext): Promise<void> {
    this.logger.log(
      `Tache cree — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return Promise.resolve();
  }
}
