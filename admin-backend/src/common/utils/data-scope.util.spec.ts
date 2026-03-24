import { DataScopeUtil } from './data-scope.util';
import { PrismaService } from '../../infrastructure';

describe('DataScopeUtil', () => {
  let prisma: Pick<PrismaService, 'user' | 'department'>;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      } as unknown as PrismaService['user'],
      department: {
        findMany: jest.fn(),
      } as unknown as PrismaService['department'],
    };
  });

  it('should return all departments in subtree with one department query', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      departmentId: 1,
      roles: [
        {
          role: {
            dataScope: 2,
            departments: [],
          },
        },
      ],
    });
    (prisma.department.findMany as jest.Mock).mockResolvedValue([
      { id: 1, parentId: null },
      { id: 2, parentId: 1 },
      { id: 3, parentId: 1 },
      { id: 4, parentId: 2 },
    ]);

    await expect(
      DataScopeUtil.getDepartmentIds(prisma as PrismaService, 1),
    ).resolves.toEqual([1, 2, 3, 4]);
    expect(prisma.department.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return null when user has all data scope', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      departmentId: 1,
      roles: [
        {
          role: {
            dataScope: 1,
            departments: [],
          },
        },
      ],
    });

    await expect(
      DataScopeUtil.getDepartmentIds(prisma as PrismaService, 1),
    ).resolves.toBeNull();
    expect(prisma.department.findMany).not.toHaveBeenCalled();
  });

  it('should return empty array when user is self only', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      departmentId: 1,
      roles: [
        {
          role: {
            dataScope: 4,
            departments: [],
          },
        },
      ],
    });

    await expect(
      DataScopeUtil.getDepartmentIds(prisma as PrismaService, 1),
    ).resolves.toEqual([]);
  });
});
