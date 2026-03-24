import { Prisma } from '@prisma/client';

const userBaseFieldSelection = {
  id: true,
  username: true,
  nickname: true,
  email: true,
  phone: true,
  avatar: true,
  avatarId: true,
  avatarName: true,
  departmentId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userDepartmentSummarySelect =
  Prisma.validator<Prisma.DepartmentSelect>()({
    id: true,
    name: true,
    code: true,
  });

export const userRoleSummarySelect = Prisma.validator<Prisma.RoleSelect>()({
  id: true,
  name: true,
  code: true,
});

export const userRoleAssignmentSelect =
  Prisma.validator<Prisma.UserRoleSelect>()({
    roleId: true,
    createdAt: true,
    role: {
      select: userRoleSummarySelect,
    },
  });

export const userBaseSelect = Prisma.validator<Prisma.UserSelect>()(
  userBaseFieldSelection,
);

export const userDetailSelect = Prisma.validator<Prisma.UserSelect>()({
  ...userBaseFieldSelection,
  department: {
    select: userDepartmentSummarySelect,
  },
  roles: {
    select: userRoleAssignmentSelect,
  },
});
