export interface DepartmentTree {
  id: number;
  name: string;
  code: string | null;
  parentId: number | null;
  leaderId: number | null;
  phone: string | null;
  email: string | null;
  sort: number;
  status: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: DepartmentTree[];
}