import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPagination, PaginationQuery } from '../common/dto/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      return await this.prisma.vehicle.create({ data: createVehicleDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Vehicle with this registrationNumber already exists');
      }
      throw error;
    }
  }

  async findAll(pagination: PaginationQuery) {
    const { skip, take, page, pageSize } = buildPagination(pagination);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.vehicle.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { reservations: true, maintenances: true },
      }),
      this.prisma.vehicle.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async findOne(id: number) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { reservations: true, maintenances: true },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle ${id} not found`);
    }

    return vehicle;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    try {
      return await this.prisma.vehicle.update({ where: { id }, data: updateVehicleDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Vehicle ${id} not found`);
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Vehicle with this registrationNumber already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.vehicle.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Vehicle ${id} not found`);
      }
      throw error;
    }
  }
}
