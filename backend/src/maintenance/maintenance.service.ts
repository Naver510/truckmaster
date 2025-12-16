import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { buildPagination, PaginationQuery } from '../common/dto/pagination.dto';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMaintenanceDto: CreateMaintenanceDto) {
    return this.prisma.maintenance.create({
      data: {
        ...createMaintenanceDto,
        date: new Date(createMaintenanceDto.date),
      },
    });
  }

  async findAll(pagination: PaginationQuery) {
    const { skip, take, page, pageSize } = buildPagination(pagination);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.maintenance.findMany({
        skip,
        take,
        orderBy: { date: 'desc' },
        include: { vehicle: true },
      }),
      this.prisma.maintenance.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async findOne(id: number) {
    const maintenance = await this.prisma.maintenance.findUnique({ where: { id }, include: { vehicle: true } });

    if (!maintenance) {
      throw new NotFoundException(`Maintenance ${id} not found`);
    }

    return maintenance;
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    try {
      return await this.prisma.maintenance.update({
        where: { id },
        data: {
          ...updateMaintenanceDto,
          date: updateMaintenanceDto.date ? new Date(updateMaintenanceDto.date) : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Maintenance ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.maintenance.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Maintenance ${id} not found`);
      }
      throw error;
    }
  }
}
