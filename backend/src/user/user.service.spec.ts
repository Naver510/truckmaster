import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const createMockPrisma = () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  const prisma = createMockPrisma();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(UserService);
  });

  it('throws conflict on duplicate email', async () => {
    const error = { code: 'P2002', name: 'PrismaClientKnownRequestError' } as any;
    prisma.user.create.mockRejectedValue(error);
    await expect(service.create({ name: 'A', email: 'a@test.com', role: Role.USER })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('paginates list', async () => {
    prisma.$transaction.mockResolvedValue([[{ id: 1 }], 10]);
    const result = await service.findAll({ page: 2, pageSize: 5 } as any);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ data: [{ id: 1 }], total: 10, page: 2, pageSize: 5 });
  });

  it('throws not found on missing user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
