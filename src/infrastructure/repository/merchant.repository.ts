// infrastructure/database/user.repository.ts
import {User} from "../entity/user.entity";
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../database/prisma.service";
import {UserRepository} from "../../domain/repositories/user.repository";

@Injectable()
export class UserRepositoryImpl  implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async save(user: User) {
        return this.prisma.user.create({
            data: {
                email: user.email,
                password: user.getPassword(),
                name: user.name
            },
        });
    }
}
