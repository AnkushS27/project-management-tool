import type { TaskStatus } from '../types';

interface Props {
  status: TaskStatus;
}

const badgeClassByStatus: Record<TaskStatus, string> = {
  todo: 'bg-amber-100 text-amber-700 border-amber-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  done: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const labelByStatus: Record<TaskStatus, string> = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function TaskStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClassByStatus[status]}`}
    >
      {labelByStatus[status]}
    </span>
  );
}
