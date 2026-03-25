import { Module } from '@nestjs/common';
import {AuthController} from "../presentation/auth.controller";
import {PrismaService} from "../infrastructure/database/prisma.service";
import {RegisterUseCase} from "../application/usecases/register.usecase";

import {MerchantRepository} from "../domain/repositories/merchant.repository";
import {MerchantRepositoryImpl} from "../infrastructure/repository/merchant.repository";


@Module({
    controllers: [AuthController],
    providers: [
        PrismaService,
        RegisterUseCase,
        {provide: MerchantRepository, useClass: MerchantRepositoryImpl},
    ],
})
export class MerchantModule {}