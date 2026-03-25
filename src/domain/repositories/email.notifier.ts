import {Injectable} from "@nestjs/common";

@Injectable
export abstract class EmailNotifier {
    abstract sendOrderNotification(merchantEmail: string, orderId: string): Promise<void>;
}