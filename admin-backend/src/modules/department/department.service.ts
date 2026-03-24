import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentTree } from './interfaces/department-tree.interface';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  // 创建部门
  async create(createDepartmentDto: CreateDepartmentDto) {
    // 检查部门编码是否已存在
    if (createDepartmentDto.code) {
      const existDept = await this.prisma.department.findUnique({
        where: { code: createDepartmentDto.code },
      });

      if (existDept) {
        throw new ConflictException('部门编码已存在');
      }
    }

    // 如果有父部门，检查父部门是否存在
    if (createDepartmentDto.parentId) {
      const parentDept = await this.prisma.department.findUnique({
        where: { id: createDepartmentDto.parentId },
      });

      if (!parentDept) {
        throw new NotFoundException('父部门不存在');
      }
    }

    return await this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  // 获取部门列表（树形结构）
  async findAll(): Promise<DepartmentTree[]> {
    const departments = await this.prisma.department.findMany({
      orderBy: { sort: 'asc' },
    });

    // 转换为树形结构
    return this.buildTree(departments as DepartmentTree[]);
  }

  // 获取单个部门
  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('部门不存在');
    }

    return department;
  }

  // 更新部门
  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.findOne(id); // 检查部门是否存在

    // 检查部门编码是否冲突
    if (updateDepartmentDto.code) {
      const existDept = await this.prisma.department.findUnique({
        where: { code: updateDepartmentDto.code },
      });

      if (existDept && existDept.id !== id) {
        throw new ConflictException('部门编码已存在');
      }
    }

    // 不能将自己设置为父部门
    if (updateDepartmentDto.parentId === id) {
      throw new ConflictException('不能将自己设置为父部门');
    }

    return await this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }

  // 删除部门
  async remove(id: number) {
    await this.findOne(id); // 检查部门是否存在

    // 检查是否有子部门
    const childrenCount = await this.prisma.department.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ConflictException('该部门下有子部门，无法删除');
    }

    // 检查是否有用户
    const usersCount = await this.prisma.user.count({
      where: { departmentId: id },
    });

    if (usersCount > 0) {
      throw new ConflictException('该部门下有用户，无法删除');
    }

    await this.prisma.department.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  // 构建树形结构
  private buildTree(departments: DepartmentTree[], parentId: number | null = null): DepartmentTree[] {
    const result: DepartmentTree[] = [];

    for (const dept of departments) {
      if (dept.parentId === parentId) {
        const children = this.buildTree(departments, dept.id);
        if (children.length > 0) {
          dept.children = children;
        }
        result.push(dept);
      }
    }

    return result;
  }
}
