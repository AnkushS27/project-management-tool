import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProjectById,
  updateProject,
} from '../features/projects/projectsSlice';
import { fetchTasksByProject } from '../features/tasks/tasksSlice';
import TasksPage from '../features/tasks/TasksPage';
import ProjectForm from '../features/projects/ProjectForm';
import type { ProjectStatus } from '../types';
import Modal from '../components/Modal';
import ProjectStatusBadge from '../components/ProjectStatusBadge';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.projects.selectedProject);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(fetchProjectById(id));
    dispatch(fetchTasksByProject({ projectId: id }));
  }, [dispatch, id]);

  if (!id) {
    return <p className="text-sm text-red-600">Invalid project id.</p>;
  }

  const saveProject = async (values: {
    title: string;
    description?: string;
    status: ProjectStatus;
  }) => {
    const result = await dispatch(updateProject({ id, payload: values }));
    if (updateProject.fulfilled.match(result)) {
      setIsEditModalOpen(false);
      await dispatch(fetchProjectById(id));
    }
  };

  return (
    <section className="space-y-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{project?.title || 'Project details'}</h1>
          {project ? <ProjectStatusBadge status={project.status} /> : null}
        </div>
        <p className="mt-1 text-slate-600">{project?.description || 'No description available.'}</p>

        {project ? (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <Pencil size={16} />
            <span>Edit Project</span>
          </button>
        ) : null}
      </div>

      <TasksPage projectId={id} />

      <Modal
        isOpen={isEditModalOpen}
        title="Edit Project"
        onClose={() => setIsEditModalOpen(false)}
      >
        {project ? (
          <ProjectForm initialData={project} submitLabel="Save Changes" onSubmit={saveProject} />
        ) : null}
      </Modal>
    </section>
  );
}
