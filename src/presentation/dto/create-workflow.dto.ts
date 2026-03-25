import { IsString, IsIn } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['user.registered', 'order.created', 'manual.trigger'])
  trigger: string;
}
