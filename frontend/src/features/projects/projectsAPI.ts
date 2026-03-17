import { axiosClient } from '../../services/axiosClient';
import type { PaginatedProjects, Project, ProjectStatus } from '../../types';

export interface ProjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
}

export interface ProjectPayload {
  title: string;
  description?: string;
  status?: ProjectStatus;
}

export const fetchProjectsRequest = async (query: ProjectsQuery) => {
  const response = await axiosClient.get<PaginatedProjects>('/projects', {
    params: query,
  });

  return response.data;
};

export const fetchProjectByIdRequest = async (id: string) => {
  const response = await axiosClient.get<Project>(`/projects/${id}`);
  return response.data;
};

export const createProjectRequest = async (payload: ProjectPayload) => {
  const response = await axiosClient.post<Project>('/projects', payload);
  return response.data;
};

export const updateProjectRequest = async (
  id: string,
  payload: Partial<ProjectPayload>,
) => {
  const response = await axiosClient.patch<Project>(`/projects/${id}`, payload);
  return response.data;
};

export const deleteProjectRequest = async (id: string) => {
  await axiosClient.delete(`/projects/${id}`);
  return id;
};
