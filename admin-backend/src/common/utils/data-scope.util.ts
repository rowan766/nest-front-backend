import { PrismaService } from '../../infrastructure';

enum DataScopeType {
  All = 1,
  DepartmentAndChildren = 2,
  DepartmentOnly = 3,
  SelfOnly = 4,
  Custom = 5,
}

type DataScopeDepartmentIds = number[] | null;

export class DataScopeUtil {
  /**
   * 根据用户的数据权限范围构建部门ID过滤条件
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns 部门ID列表（用于 WHERE departmentId IN (...)），null 表示全部数据权限
   */
  static async getDepartmentIds(
    prisma: PrismaService,
    userId: number,
  ): Promise<DataScopeDepartmentIds> {
    // 获取用户信息（含部门）
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        departmentId: true,
        roles: {
          select: {
            role: {
              select: {
                dataScope: true,
                departments: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const departmentIds = new Set<number>();
    let departmentAndChildrenIds: number[] | undefined;

    // 遍历用户的所有角色
    for (const userRole of user.roles) {
      const role = userRole.role;

      switch (role.dataScope) {
        case DataScopeType.All:
          // 返回 null 表示不需要过滤部门
          return null;

        case DataScopeType.DepartmentAndChildren:
          if (user.departmentId) {
            departmentAndChildrenIds ??= await this.getDepartmentSubtreeIds(
              prisma,
              user.departmentId,
            );
            departmentAndChildrenIds.forEach((id) => departmentIds.add(id));
          }
          break;

        case DataScopeType.DepartmentOnly:
          if (user.departmentId) {
            departmentIds.add(user.departmentId);
          }
          break;

        case DataScopeType.SelfOnly:
          // 这种情况需要额外处理，通常是添加 userId 过滤条件
          // 这里返回空数组，调用方需要自行添加 userId 过滤
          return []; // 返回空数组表示仅本人

        case DataScopeType.Custom:
          // 添加角色关联的部门
          role.departments.forEach((dept) => {
            departmentIds.add(dept.departmentId);
          });
          break;
      }
    }

    return Array.from(departmentIds);
  }

  /**
   * 获取部门及所有子部门的ID列表
   * @param prisma Prisma服务
   * @param departmentId 部门ID
   * @returns 部门ID列表（包含自身）
   */
  private static async getDepartmentSubtreeIds(
    prisma: PrismaService,
    departmentId: number,
  ): Promise<number[]> {
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        parentId: true,
      },
    });
    const childrenMap = new Map<number, number[]>();

    for (const department of departments) {
      if (department.parentId === null) {
        continue;
      }

      const children = childrenMap.get(department.parentId) ?? [];
      children.push(department.id);
      childrenMap.set(department.parentId, children);
    }

    const result: number[] = [];
    const queue = [departmentId];
    const visited = new Set<number>();

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (currentId === undefined || visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      result.push(currentId);
      queue.push(...(childrenMap.get(currentId) ?? []));
    }

    return result;
  }

  /**
   * 检查用户是否只能看到自己的数据
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns true表示仅本人数据权限
   */
  static async isSelfOnly(prisma: PrismaService, userId: number): Promise<boolean> {
    const departmentIds = await this.getDepartmentIds(prisma, userId);
    return departmentIds !== null && departmentIds.length === 0;
  }

  /**
   * 检查用户是否有全部数据权限
   * @param prisma Prisma服务
   * @param userId 用户ID
   * @returns true表示全部数据权限
   */
  static async hasAllDataScope(prisma: PrismaService, userId: number): Promise<boolean> {
    const departmentIds = await this.getDepartmentIds(prisma, userId);
    return departmentIds === null;
  }
}
