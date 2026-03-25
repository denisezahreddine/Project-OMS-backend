import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { PresentationModule } from './presentation/presentation.module';
import { WorkflowModule } from './modules/workflow.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ApplicationModule,
    DomainModule,
    InfrastructureModule,
    PresentationModule,
    WorkflowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
