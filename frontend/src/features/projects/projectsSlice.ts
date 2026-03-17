import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createProjectRequest,
  deleteProjectRequest,
  fetchProjectByIdRequest,
  fetchProjectsRequest,
  updateProjectRequest,
  type ProjectPayload,
  type ProjectsQuery,
} from './projectsAPI';
import type { PaginatedProjects, Project } from '../../types';

interface ProjectsState {
  list: Project[];
  selectedProject: Project | null;
  pagination: Omit<PaginatedProjects, 'items'>;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  list: [],
  selectedProject: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (query: ProjectsQuery, { rejectWithValue }) => {
    try {
      return await fetchProjectsRequest(query);
    } catch {
      return rejectWithValue('Failed to load projects');
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchProjectByIdRequest(id);
    } catch {
      return rejectWithValue('Failed to load project details');
    }
  },
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (payload: ProjectPayload, { rejectWithValue }) => {
    try {
      return await createProjectRequest(payload);
    } catch {
      return rejectWithValue('Failed to create project');
    }
  },
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    data: { id: string; payload: Partial<ProjectPayload> },
    { rejectWithValue },
  ) => {
    try {
      return await updateProjectRequest(data.id, data.payload);
    } catch {
      return rejectWithValue('Failed to update project');
    }
  },
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteProjectRequest(id);
    } catch {
      return rejectWithValue('Failed to delete project');
    }
  },
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load projects';
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.list = state.list.map((project) =>
          project._id === action.payload._id ? action.payload : project,
        );
        if (state.selectedProject?._id === action.payload._id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((project) => project._id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;
