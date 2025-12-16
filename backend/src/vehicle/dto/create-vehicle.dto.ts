import { VehicleStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateVehicleDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(20)
	registrationNumber!: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	make!: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	model!: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1900)
	year?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(0)
	mileage?: number;

	@IsOptional()
	@IsEnum(VehicleStatus)
	status?: VehicleStatus;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	location?: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	notes?: string;
}
