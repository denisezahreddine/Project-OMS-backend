import { Injectable, Logger } from '@nestjs/common';
import {
  ActionHandler,
  ActionContext,
  ActionResult,
} from '../../../domain/ports/action-handler.port';

@Injectable()
export class CreateTaskHandler implements ActionHandler {
  private readonly logger = new Logger(CreateTaskHandler.name);

  async execute(context: ActionContext): Promise<ActionResult> {
    this.logger.log(
      `Tache cree — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,
    );
    return {
      success: true,
      message: `Tache cree — merchant: ${context.merchantId} — data: ${JSON.stringify(context.eventData)}`,

    };
  }
}
