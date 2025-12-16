import type { Vehicle } from '../../vehicle/entities/vehicle.entity';

export class Maintenance {
	id!: number;
	vehicleId!: number;
	vehicle?: Vehicle;
	date!: Date;
	description?: string | null;
	cost?: number | null;
	performedBy?: string | null;
	createdAt!: Date;
	updatedAt!: Date;
}
