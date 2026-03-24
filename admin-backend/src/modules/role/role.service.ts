import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignMenusDto } from './dto/assign-menus.dto';
import { SetDataScopeDto } from './dto/set-data-scope.dto';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  // 创建角色
  async create(createRoleDto: CreateRoleDto) {
    // 检查角色名称是否已存在
    const existByName = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existByName) {
      throw new ConflictException('角色名称已存在');
    }

    // 检查角色编码是否已存在
    const existByCode = await this.prisma.role.findUnique({
      where: { code: createRoleDto.code },
    });

    if (existByCode) {
      throw new ConflictException('角色编码已存在');
    }

    return await this.prisma.role.create({
      data: createRoleDto,
    });
  }

  // 获取角色列表
  async findAll(queryRoleDto: QueryRoleDto) {
    const {
      page = 1,
      pageSize = 10,
      name,
      code,
      status,
    } = queryRoleDto;

    const where = {
      ...(name
        ? {
            name: {
              contains: name,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(code
        ? {
            code: {
              contains: code,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(typeof status === 'number' ? { status } : {}),
    };

    const include = {
      users: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
            },
          },
        },
      },
      menus: {
        include: {
          menu: {
            select: {
              id: true,
              name: true,
              title: true,
            },
          },
        },
      },
      departments: {
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    };

    const [list, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        orderBy: { sort: 'asc' },
        include,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  // 获取单个角色
  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                email: true,
                phone: true,
                departmentId: true,
              },
            },
          },
        },
        menus: {
          include: {
            menu: true,
          },
        },
        departments: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('角色不存在');
    }

    return role;
  }

  // 更新角色
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.findOne(id); // 检查角色是否存在

    // 检查角色名称是否冲突
    if (updateRoleDto.name) {
      const existByName = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });

      if (existByName && existByName.id !== id) {
        throw new ConflictException('角色名称已存在');
      }
    }

    // 检查角色编码是否冲突
    if (updateRoleDto.code) {
      const existByCode = await this.prisma.role.findUnique({
        where: { code: updateRoleDto.code },
      });

      if (existByCode && existByCode.id !== id) {
        throw new ConflictException('角色编码已存在');
      }
    }

    return await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  // 删除角色
  async remove(id: number) {
    await this.findOne(id); // 检查角色是否存在

    // 检查是否有用户使用该角色
    const usersCount = await this.prisma.userRole.count({
      where: { roleId: id },
    });

    if (usersCount > 0) {
      throw new ConflictException('该角色下有用户，无法删除');
    }

    // Prisma 会自动级联删除关联表的数据（因为设置了 onDelete: Cascade）
    await this.prisma.role.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  // 为角色分配菜单权限
  async assignMenus(id: number, assignMenusDto: AssignMenusDto) {
    await this.findOne(id); // 检查角色是否存在

    // 检查所有菜单是否存在
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: assignMenusDto.menuIds } },
    });

    if (menus.length !== assignMenusDto.menuIds.length) {
      throw new NotFoundException('部分菜单不存在');
    }

    // 使用事务：先删除旧的菜单关联，再创建新的关联
    return await this.prisma.$transaction(async (tx) => {
      // 删除旧的菜单关联
      await tx.roleMenu.deleteMany({
        where: { roleId: id },
      });

      // 创建新的菜单关联
      await tx.roleMenu.createMany({
        data: assignMenusDto.menuIds.map((menuId) => ({
          roleId: id,
          menuId,
        })),
      });

      // 返回更新后的角色信息
      return await tx.role.findUnique({
        where: { id },
        include: {
          menus: {
            include: {
              menu: true,
            },
          },
        },
      });
    });
  }

  // 设置角色的数据权限范围
  async setDataScope(id: number, setDataScopeDto: SetDataScopeDto) {
    await this.findOne(id); // 检查角色是否存在

    // 如果数据权限范围是自定义（5），必须提供部门ID列表
    if (setDataScopeDto.dataScope === 5) {
      if (!setDataScopeDto.departmentIds || setDataScopeDto.departmentIds.length === 0) {
        throw new BadRequestException('自定义数据权限必须指定部门列表');
      }

      // 检查所有部门是否存在
      const departments = await this.prisma.department.findMany({
        where: { id: { in: setDataScopeDto.departmentIds } },
      });

      if (departments.length !== setDataScopeDto.departmentIds.length) {
        throw new NotFoundException('部分部门不存在');
      }
    }

    // 使用事务更新数据权限
    return await this.prisma.$transaction(async (tx) => {
      // 更新角色的 dataScope
      await tx.role.update({
        where: { id },
        data: { dataScope: setDataScopeDto.dataScope },
      });

      // 删除旧的部门关联
      await tx.roleDepartment.deleteMany({
        where: { roleId: id },
      });

      // 如果是自定义数据权限，创建新的部门关联
      if (setDataScopeDto.dataScope === 5 && setDataScopeDto.departmentIds) {
        await tx.roleDepartment.createMany({
          data: setDataScopeDto.departmentIds.map((departmentId) => ({
            roleId: id,
            departmentId,
          })),
        });
      }

      // 返回更新后的角色信息
      return await tx.role.findUnique({
        where: { id },
        include: {
          departments: {
            include: {
              department: true,
            },
          },
        },
      });
    });
  }
}
