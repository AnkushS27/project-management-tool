import { axiosClient } from '../../services/axiosClient';
import type { Task, TaskStatus } from '../../types';

export interface TaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  project: string;
}

export const fetchTasksByProjectRequest = async (
  projectId: string,
  status?: TaskStatus,
) => {
  const response = await axiosClient.get<Task[]>(`/tasks/project/${projectId}`, {
    params: status ? { status } : undefined,
  });

  return response.data;
};

export const createTaskRequest = async (payload: TaskPayload) => {
  const response = await axiosClient.post<Task>('/tasks', payload);
  return response.data;
};

export const updateTaskRequest = async (id: string, payload: Partial<TaskPayload>) => {
  const response = await axiosClient.patch<Task>(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTaskRequest = async (id: string) => {
  await axiosClient.delete(`/tasks/${id}`);
  return id;
};
