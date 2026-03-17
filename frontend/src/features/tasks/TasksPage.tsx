import { useEffect, useMemo, useState } from 'react';
import { FunnelX, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { RootState } from '../../app/store';
import { createTask, deleteTask, fetchTasksByProject, updateTask } from './tasksSlice';
import TaskForm from './TaskForm';
import type { Task, TaskStatus } from '../../types';
import Modal from '../../components/Modal';
import TaskStatusBadge from '../../components/TaskStatusBadge';

interface Props {
  projectId: string;
}

export default function TasksPage({ projectId }: Props) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state: RootState) => state.tasks.list);
  const loading = useAppSelector((state: RootState) => state.tasks.loading);
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [titleSearch, setTitleSearch] = useState('');
  const [debouncedTitleSearch, setDebouncedTitleSearch] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const hasActiveFilters =
    status !== 'all' || Boolean(titleSearch.trim()) || Boolean(dueDateFilter);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedTitleSearch(titleSearch.trim().toLowerCase());
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [titleSearch]);

  const filteredTasks = useMemo(
    () => {
      return tasks.filter((task: Task) => {
        const statusMatch = status === 'all' ? true : task.status === status;
        const titleMatch = debouncedTitleSearch
          ? task.title.toLowerCase().includes(debouncedTitleSearch)
          : true;
        const dueDateMatch = dueDateFilter
          ? (task.dueDate ? task.dueDate.slice(0, 10) === dueDateFilter : false)
          : true;

        return statusMatch && titleMatch && dueDateMatch;
      });
    },
    [debouncedTitleSearch, dueDateFilter, status, tasks],
  );

  const applyStatusFilter = (nextStatus: TaskStatus | 'all') => {
    setStatus(nextStatus);
  };

  const addTask = async (values: {
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string;
  }) => {
    const result = await dispatch(createTask({ ...values, project: projectId }));
    if (createTask.fulfilled.match(result)) {
      setIsCreateModalOpen(false);
      await dispatch(fetchTasksByProject({ projectId }));
    }
  };

  const removeTask = async (id: string) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      await dispatch(fetchTasksByProject({ projectId }));
    }
  };

  const editTask = async (
    id: string,
    values: {
      title: string;
      description?: string;
      status: TaskStatus;
      dueDate?: string;
    },
  ) => {
    const result = await dispatch(updateTask({ id, data: values }));
    if (updateTask.fulfilled.match(result)) {
      setEditingTask(null);
      await dispatch(fetchTasksByProject({ projectId }));
    }
  };

  const clearFilters = () => {
    setStatus('all');
    setTitleSearch('');
    setDueDateFilter('');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:items-center">
          <input
            value={titleSearch}
            onChange={(event) => setTitleSearch(event.target.value)}
            placeholder="Search task title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(event) => {
              applyStatusFilter(event.target.value as TaskStatus | 'all');
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="date"
            value={dueDateFilter}
            onChange={(event) => setDueDateFilter(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
          >
            <FunnelX size={16} />
            <span>Clear Filters</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex justify-center items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        {loading && tasks.length === 0 ? <p>Loading tasks...</p> : null}

        <div className="space-y-3">
          {!loading && filteredTasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                {hasActiveFilters
                  ? 'No tasks match your current search or filters.'
                  : 'No tasks found for this project yet. Add your first task.'}
              </p>
            </div>
          ) : null}

          {filteredTasks.map((task: Task) => (
            <article key={task._id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-slate-600">{task.description || 'No description'}</p>
                  <div className="mt-2">
                    <TaskStatusBadge status={task.status} />
                  </div>
                  {task.dueDate ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      void removeTask(task._id);
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        title="Create Task"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <TaskForm submitLabel="Create Task" onSubmit={addTask} />
      </Modal>

      <Modal
        isOpen={Boolean(editingTask)}
        title="Edit Task"
        onClose={() => setEditingTask(null)}
      >
        {editingTask ? (
          <TaskForm
            initialData={editingTask}
            submitLabel="Update Task"
            onSubmit={(values) => editTask(editingTask._id, values)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
