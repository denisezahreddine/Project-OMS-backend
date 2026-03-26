import { IsString, IsIn, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class WorkflowConditionDto {
  @IsString()
  field: string;

  @IsString()
  @IsIn(['>', '<', '>=', '<=', '===', '!=='])
  operator: '>' | '<' | '>=' | '<=' | '===' | '!==';

  @IsNotEmpty()
  value: number | string | boolean;
}

export class WorkflowDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsIn(['user.registered', 'order.created', 'updated.status', 'order.notpaid', 'manual.trigger'])
  @ApiProperty()
  trigger: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkflowConditionDto)
  @ApiProperty({ required: false, example: { field: 'total', operator: '>', value: 100 } })
  condition?: WorkflowConditionDto;
}
