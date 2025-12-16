import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReservationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPagination, PaginationQuery } from '../common/dto/pagination.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReservationDto: CreateReservationDto) {
    this.ensureDatesAreValid(createReservationDto.startDatetime, createReservationDto.endDatetime);

    await this.assertNoOverlap(createReservationDto.vehicleId, null, createReservationDto.startDatetime, createReservationDto.endDatetime);

    return this.prisma.reservation.create({
      data: {
        ...createReservationDto,
        status: createReservationDto.status ?? ReservationStatus.ACTIVE,
        startDatetime: new Date(createReservationDto.startDatetime),
        endDatetime: new Date(createReservationDto.endDatetime),
      },
    });
  }

  async findAll(pagination: PaginationQuery) {
    const { skip, take, page, pageSize } = buildPagination(pagination);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.reservation.findMany({
        skip,
        take,
        orderBy: { startDatetime: 'desc' },
        include: { user: true, vehicle: true },
      }),
      this.prisma.reservation.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { user: true, vehicle: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const existing = await this.prisma.reservation.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Reservation ${id} not found`);
    }

    const start = updateReservationDto.startDatetime ?? existing.startDatetime.toISOString();
    const end = updateReservationDto.endDatetime ?? existing.endDatetime.toISOString();
    const vehicleId = updateReservationDto.vehicleId ?? existing.vehicleId;

    this.ensureDatesAreValid(start, end);
    await this.assertNoOverlap(vehicleId, id, start, end);

    try {
      return await this.prisma.reservation.update({
        where: { id },
        data: {
          ...updateReservationDto,
          vehicleId,
          startDatetime: new Date(start),
          endDatetime: new Date(end),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Reservation ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.reservation.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Reservation ${id} not found`);
      }
      throw error;
    }
  }

  private ensureDatesAreValid(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid reservation dates');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Reservation endDatetime must be after startDatetime');
    }
  }

  private async assertNoOverlap(
    vehicleId: number | undefined,
    excludeId: number | null,
    start: string,
    end: string,
  ) {
    if (!vehicleId) return;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        vehicleId,
        status: ReservationStatus.ACTIVE,
        id: excludeId ? { not: excludeId } : undefined,
        startDatetime: { lt: endDate },
        endDatetime: { gt: startDate },
      },
    });

    if (overlapping) {
      throw new ConflictException('Vehicle already reserved in this time window');
    }
  }
}
