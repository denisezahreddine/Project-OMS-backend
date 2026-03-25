import {Global, Module} from "@nestjs/common";
import {PrismaService} from "./infrastructure/database/prisma.service";

@Global() // Le rend disponible partout sans ré-import
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}