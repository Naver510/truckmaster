import { VehicleStatus } from '@prisma/client';
import type { Maintenance } from '../../maintenance/entities/maintenance.entity';
import type { Reservation } from '../../reservation/entities/reservation.entity';

export class Vehicle {
	id!: number;
	registrationNumber!: string;
	make!: string;
	model!: string;
	year?: number | null;
	mileage?: number | null;
	status!: VehicleStatus;
	location?: string | null;
	notes?: string | null;
	reservations?: Reservation[];
	maintenances?: Maintenance[];
	createdAt!: Date;
	updatedAt!: Date;
}
