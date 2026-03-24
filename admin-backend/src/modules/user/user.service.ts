import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { QueryUserDto } from './dto/query-user.dto';
import * as bcrypt from 'bcrypt';
import { userBaseSelect, userDetailSelect } from './user.select';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 创建用户
  async create(createUserDto: CreateUserDto) {
    // 检查用户名是否已存在
    const existUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (createUserDto.email) {
      const existEmail = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    // 检查部门是否存在
    if (createUserDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: createUserDto.departmentId },
      });

      if (!department) {
        throw new NotFoundException(`部门ID ${createUserDto.departmentId} 不存在`);
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: userBaseSelect,
    });
  }

  // 查询所有用户
  async findAll(queryUserDto: QueryUserDto) {
    const {
      page = 1,
      pageSize = 10,
      username,
      email,
    } = queryUserDto;

    const where: Prisma.UserWhereInput = {
      ...(username
        ? {
            username: {
              contains: username,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(email
        ? {
            email: {
              contains: email,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: userDetailSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
    };
  }

  // 查询单个用户
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userDetailSelect,
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 检查用户是否存在

    if (updateUserDto.username) {
      const existUser = await this.prisma.user.findFirst({
        where: {
          username: updateUserDto.username,
          id: { not: id },
        },
        select: { id: true },
      });

      if (existUser) {
        throw new ConflictException('用户名已存在');
      }
    }

    if (updateUserDto.email) {
      const existEmail = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id },
        },
        select: { id: true },
      });

      if (existEmail) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    if (updateUserDto.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: updateUserDto.departmentId },
        select: { id: true },
      });

      if (!department) {
        throw new NotFoundException(`部门ID ${updateUserDto.departmentId} 不存在`);
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: userDetailSelect,
    });

    return user;
  }

  // 删除用户
  async remove(id: number) {
    await this.findOne(id); // 检查用户是否存在
    
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  // 更新密码
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    // 1. 查找用户
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 2. 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new ConflictException('旧密码错误');
    }

    // 3. 加密新密码
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    // 4. 更新密码
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: '密码修改成功' };
  }

  // 为用户分配角色
  async assignRoles(userId: number, roleIds: number[]) {
    // 检查用户是否存在
    await this.findOne(userId);

    // 检查所有角色是否存在
    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('部分角色不存在');
    }

    // 使用事务：先删除旧的角色关联，再创建新的关联
    return await this.prisma.$transaction(async (tx) => {
      // 删除旧的角色关联
      await tx.userRole.deleteMany({
        where: { userId },
      });

      // 创建新的角色关联
      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({
            userId,
            roleId,
          })),
        });
      }

      // 返回更新后的用户信息
      return await tx.user.findUnique({
        where: { id: userId },
        select: userDetailSelect,
      });
    });
  }

  // 获取用户的菜单权限（树形结构）
  async getUserMenus(userId: number) {
    // 查询用户的所有角色及菜单
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            menus: {
              include: {
                menu: true,
              },
            },
          },
        },
      },
    });

    // 收集所有菜单（去重）
    const menuMap = new Map();
    for (const userRole of userRoles) {
      for (const roleMenu of userRole.role.menus) {
        const menu = roleMenu.menu;
        // 只返回启用且可见的菜单
        if (menu.status === 1 && menu.visible === 1) {
          menuMap.set(menu.id, menu);
        }
      }
    }

    // 转换为数组并按 sort 排序
    const menus = Array.from(menuMap.values()).sort((a, b) => a.sort - b.sort);

    // 构建树形结构
    return this.buildMenuTree(menus);
  }

  // 构建菜单树
  private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
    const result: any[] = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildMenuTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        result.push(menu);
      }
    }

    return result;
  }
}
