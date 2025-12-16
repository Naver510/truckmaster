import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name!: string;

	@IsEmail()
	@MaxLength(255)
	email!: string;

	@IsOptional()
	@IsString()
	@MaxLength(30)
	phone?: string;

	@IsOptional()
	@IsEnum(Role)
	role?: Role;
}
