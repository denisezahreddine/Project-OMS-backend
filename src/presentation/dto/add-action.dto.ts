import { IsString, IsInt, IsIn, IsOptional, Min } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class AddActionDto {

  @ApiProperty()
  @IsString()
  @IsIn(['notify_admin', 'notify_user', 'create_log', 'create_task'])
  type: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty()
  @IsOptional()
  config?: Record<string, unknown>;
}
