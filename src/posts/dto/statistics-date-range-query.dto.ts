import { IsDateString, IsOptional } from 'class-validator';

export class StatisticsDateRangeQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
