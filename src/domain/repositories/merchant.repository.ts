import {Merchant} from "../models/merchant.domain";

@Injectable()
export interface MerchantRepository {
    save(merchant: Partial<Merchant>): Promise<Merchant>;
    findByEmail(email: string): Promise<Merchant | null>;
}