import { IsString, IsInt, IsIn, IsOptional, Min } from 'class-validator';

export class AddActionDto {
  @IsString()
  @IsIn(['notify_admin', 'notify_user', 'create_log', 'create_task'])
  type: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsOptional()
  config?: Record<string, unknown>;
}
