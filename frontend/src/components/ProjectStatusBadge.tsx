import type { ProjectStatus } from '../types';

interface Props {
  status: ProjectStatus;
}

const badgeClassByStatus: Record<ProjectStatus, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  active: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const labelByStatus: Record<ProjectStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  completed: 'Completed',
};

export default function ProjectStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClassByStatus[status]}`}
    >
      {labelByStatus[status]}
    </span>
  );
}
