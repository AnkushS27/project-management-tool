import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Plus } from 'lucide-react';
import type { Project, ProjectStatus } from '../../types';

const schema = yup
  .object({
    title: yup.string().required('Title is required').max(120),
    description: yup.string().max(1000).optional(),
    status: yup
      .mixed<ProjectStatus>()
      .oneOf(['draft', 'active', 'completed'])
      .required(),
  })
  .required();

interface Props {
  initialData?: Project;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: ProjectStatus;
  }) => Promise<void>;
  submitLabel: string;
}

export default function ProjectForm({ initialData, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: initialData?.status ?? 'draft',
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
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
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
