import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateMaintenanceDto {
	@Type(() => Number)
	@IsPositive()
	vehicleId!: number;

	@IsDateString()
	date!: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	description?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	cost?: number;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	performedBy?: string;
}
