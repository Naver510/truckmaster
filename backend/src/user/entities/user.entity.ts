import { Role } from '@prisma/client';
import type { Reservation } from '../../reservation/entities/reservation.entity';

export class User {
	id!: number;
	name!: string;
	email!: string;
	phone?: string | null;
	role!: Role;
	reservations?: Reservation[];
	createdAt!: Date;
	updatedAt!: Date;
}
