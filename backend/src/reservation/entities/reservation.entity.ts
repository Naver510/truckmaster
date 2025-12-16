import { ReservationStatus } from '@prisma/client';
import type { User } from '../../user/entities/user.entity';
import type { Vehicle } from '../../vehicle/entities/vehicle.entity';

export class Reservation {
	id!: number;
	vehicleId!: number;
	userId!: number;
	vehicle?: Vehicle;
	user?: User;
	startDatetime!: Date;
	endDatetime!: Date;
	purpose?: string | null;
	status!: ReservationStatus;
	createdAt!: Date;
	updatedAt!: Date;
}
