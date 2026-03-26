import { IsString, IsIn } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class WorkflowDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsIn(['user.registered', 'order.created', 'manual.trigger'])
  @ApiProperty()
  trigger: string;
}
