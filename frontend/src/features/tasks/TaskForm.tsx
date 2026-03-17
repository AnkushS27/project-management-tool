import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';

const schema = yup
  .object({
    title: yup.string().required('Title is required').max(120),
    description: yup.string().optional().max(1000),
    status: yup
      .mixed<TaskStatus>()
      .oneOf(['todo', 'in-progress', 'done'])
      .required(),
    dueDate: yup.string().optional(),
  })
  .required();

interface Props {
  initialData?: Task;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string;
  }) => Promise<void>;
  submitLabel: string;
}

export default function TaskForm({ initialData, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'todo',
      dueDate: initialData?.dueDate?.slice(0, 10) ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border border-slate-200 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          {...register('title')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Status</label>
        <select {...register('status')} className="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {submitLabel.toLowerCase().includes('create') ? <Plus size={16} /> : <Check size={16} />}
        <span>{submitLabel}</span>
      </button>
    </form>
  );
}
