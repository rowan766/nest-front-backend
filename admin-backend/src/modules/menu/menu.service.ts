import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuTree } from './interfaces/menu-tree.interface';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  private resolveButtonName(menu: {
    name?: string | null;
    permission?: string | null;
    title?: string | null;
  }) {
    return menu.name?.trim() || menu.permission?.trim() || menu.title?.trim();
  }

  private normalizeMenuPayload(
    menuDto: Partial<CreateMenuDto>,
    existingMenu?: {
      type?: string | null;
      name?: string | null;
      title?: string | null;
      path?: string | null;
      component?: string | null;
      permission?: string | null;
      icon?: string | null;
      visible?: number | null;
    },
  ) {
    const type = menuDto.type ?? existingMenu?.type;
    const path = menuDto.path ?? existingMenu?.path;
    const permission = menuDto.permission ?? existingMenu?.permission;
    const buttonName = this.resolveButtonName({
      ...existingMenu,
      ...menuDto,
    });

    if (type === 'menu') {
      if (!path) {
        throw new ConflictException('菜单类型必须提供路由路径');
      }

      if (!(menuDto.name?.trim() || existingMenu?.name?.trim())) {
        throw new ConflictException('菜单类型必须提供路由名称');
      }

      return {
        ...menuDto,
        name: menuDto.name?.trim() || existingMenu?.name?.trim(),
      };
    }

    if (type === 'button') {
      if (!permission) {
        throw new ConflictException('按钮类型必须提供权限标识');
      }

      return {
        ...menuDto,
        name: buttonName,
        path: null,
        component: null,
        icon: null,
        visible: menuDto.visible ?? existingMenu?.visible ?? 1,
      };
    }

    return menuDto;
  }

  // 创建菜单
  async create(createMenuDto: CreateMenuDto) {
    // 如果有父菜单，检查父菜单是否存在
    if (createMenuDto.parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: createMenuDto.parentId },
      });

      if (!parentMenu) {
        throw new NotFoundException('父菜单不存在');
      }

      // 父菜单不能是按钮类型
      if (parentMenu.type === 'button') {
        throw new ConflictException('按钮类型不能作为父菜单');
      }
    }

    const payload = this.normalizeMenuPayload(createMenuDto) as CreateMenuDto & {
      name: string;
      path?: string | null;
      component?: string | null;
      permission?: string | null;
      icon?: string | null;
    };

    return await this.prisma.menu.create({
      data: payload,
    });
  }

  // 获取菜单列表（树形结构）
  async findAll(): Promise<MenuTree[]> {
    const menus = await this.prisma.menu.findMany({
      orderBy: { sort: 'asc' },
    });

    // 转换为树形结构
    return this.buildTree(menus as MenuTree[]);
  }

  // 获取单个菜单
  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException('菜单不存在');
    }

    return menu;
  }

  // 更新菜单
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id); // 检查菜单是否存在

    // 不能将自己设置为父菜单
    if (updateMenuDto.parentId === id) {
      throw new ConflictException('不能将自己设置为父菜单');
    }

    // 如果更新了父菜单，检查父菜单是否存在
    if (updateMenuDto.parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: updateMenuDto.parentId },
      });

      if (!parentMenu) {
        throw new NotFoundException('父菜单不存在');
      }

      // 父菜单不能是按钮类型
      if (parentMenu.type === 'button') {
        throw new ConflictException('按钮类型不能作为父菜单');
      }
    }

    const existMenu = await this.findOne(id);
    const payload = this.normalizeMenuPayload(updateMenuDto, existMenu);

    return await this.prisma.menu.update({
      where: { id },
      data: payload,
    });
  }

  // 删除菜单
  async remove(id: number) {
    await this.findOne(id); // 检查菜单是否存在

    // 检查是否有子菜单
    const childrenCount = await this.prisma.menu.count({
      where: { parentId: id },
    });

    if (childrenCount > 0) {
      throw new ConflictException('该菜单下有子菜单或按钮，无法删除');
    }

    // 检查是否有角色使用该菜单
    const rolesCount = await this.prisma.roleMenu.count({
      where: { menuId: id },
    });

    if (rolesCount > 0) {
      throw new ConflictException('该菜单已分配给角色，无法删除');
    }

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: '删除成功' };
  }

  // 构建树形结构
  private buildTree(menus: MenuTree[], parentId: number | null = null): MenuTree[] {
    const result: MenuTree[] = [];

    for (const menu of menus) {
      if (menu.parentId === parentId) {
        const children = this.buildTree(menus, menu.id);
        if (children.length > 0) {
          menu.children = children;
        }
        result.push(menu);
      }
    }

    return result;
  }
}
