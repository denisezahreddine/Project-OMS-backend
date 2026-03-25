import { Injectable } from '@nestjs/common';
import { MerchantEntity } from '../models/merchant.entity';

@Injectable()
export abstract class MerchantPort {
  abstract save(merchant: Partial<MerchantEntity>): Promise<MerchantEntity>;
  abstract findByEmail(email: string): Promise<MerchantEntity | null>;
}
