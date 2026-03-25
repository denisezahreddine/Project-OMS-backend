import {Injectable} from "@nestjs/common";

export abstract class EmailNotifier {
    abstract sendOrderNotification(merchantEmail: string, orderId: string): Promise<void>;
}