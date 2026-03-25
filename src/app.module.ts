import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DomainModule,
    InfrastructureModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
