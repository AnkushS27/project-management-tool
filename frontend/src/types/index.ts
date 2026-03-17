import type { Project } from '@project-management/types';

export * from '@project-management/types';

export interface PaginatedProjects {
  items: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
