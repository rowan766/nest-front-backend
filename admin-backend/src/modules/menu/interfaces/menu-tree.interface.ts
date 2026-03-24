export interface MenuTree {
  id: number;
  parentId: number | null;
  name: string;
  title: string;
  type: string;
  path: string | null;
  component: string | null;
  permission: string | null;
  icon: string | null;
  sort: number;
  visible: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  children?: MenuTree[];
}
