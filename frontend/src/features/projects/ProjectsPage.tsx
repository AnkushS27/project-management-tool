import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { createProject, fetchProjects } from './projectsSlice';
import ProjectForm from './ProjectForm';
import Modal from '../../components/Modal';
import type { Project, ProjectStatus } from '../../types';
import ProjectStatusBadge from '../../components/ProjectStatusBadge';

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { list, pagination, loading } = useAppSelector(
    (state: RootState) => state.projects,
  );
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const hasActiveFilters = Boolean(search.trim()) || status !== 'all';

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => window.clearTimeout(timerId);
  }, [search]);

  useEffect(() => {
    void dispatch(
      fetchProjects({
        page: 1,
        limit: pagination.limit,
        search: debouncedSearch,
        status: status === 'all' ? undefined : status,
      }),
    );
  }, [debouncedSearch, dispatch, pagination.limit, status]);

  const submitProject = async (values: {
    title: string;
    description?: string;
    status: 'draft' | 'active' | 'completed';
  }) => {
    const result = await dispatch(createProject(values));
    if (createProject.fulfilled.match(result)) {
      setIsCreateModalOpen(false);
      await dispatch(
        fetchProjects({
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          status: status === 'all' ? undefined : status,
        }),
      );
    }
  };

  const prevPage = async () => {
    const nextPage = Math.max(1, pagination.page - 1);
    await dispatch(
      fetchProjects({
        page: nextPage,
        limit: pagination.limit,
          search: debouncedSearch,
        status: status === 'all' ? undefined : status,
      }),
    );
  };

  const nextPage = async () => {
    const next = Math.min(pagination.totalPages, pagination.page + 1);
    await dispatch(
      fetchProjects({
        page: next,
        limit: pagination.limit,
          search: debouncedSearch,
        status: status === 'all' ? undefined : status,
      }),
    );
  };

  const applyStatus = (nextStatus: ProjectStatus | 'all') => {
    setStatus(nextStatus);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          />
          <select
            value={status}
            onChange={(event) => {
              applyStatus(event.target.value as ProjectStatus | 'all');
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>

        <h2 className="mb-3 text-xl font-semibold">Projects</h2>
        {loading && list.length === 0 ? <p>Loading projects...</p> : null}
        <div className="space-y-3">
          {!loading && list.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                {hasActiveFilters
                  ? 'No projects match your current search or filters.'
                  : 'No projects found yet. Create your first project to get started.'}
              </p>
            </div>
          ) : null}

          {list.map((project: Project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block rounded-lg border border-slate-200 p-3 hover:border-slate-400"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{project.title}</h3>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="text-sm text-slate-600">{project.description || 'No description'}</p>
              <p className="mt-2 text-xs text-slate-500">
                Tasks: <span className="font-semibold text-slate-700">{project.taskCount ?? 0}</span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            onClick={prevPage}
            disabled={pagination.page <= 1}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <p>
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <button
            onClick={nextPage}
            disabled={pagination.page >= pagination.totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-50"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        title="Create Project"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ProjectForm submitLabel="Create" onSubmit={submitProject} />
      </Modal>
    </div>
  );
}
