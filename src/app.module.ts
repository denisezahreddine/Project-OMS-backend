import {Module} from '@nestjs/common';
import {PrismaModule} from "./modules/prisma.module";
import {MerchantModule} from "./modules/merchant.module";
import {OrderModule} from "./modules/order.module";


@Module({
    imports: [PrismaModule, MerchantModule,OrderModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
