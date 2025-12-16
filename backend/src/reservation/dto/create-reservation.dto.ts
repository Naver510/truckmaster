import { ReservationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateReservationDto {
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	vehicleId!: number;

	@Type(() => Number)
	@IsInt()
	@IsPositive()
	userId!: number;

	@IsDateString()
	startDatetime!: string;

	@IsDateString()
	endDatetime!: string;

	@IsOptional()
	@IsString()
	@MaxLength(255)
	purpose?: string;

	@IsOptional()
	@IsEnum(ReservationStatus)
	status?: ReservationStatus;
}
