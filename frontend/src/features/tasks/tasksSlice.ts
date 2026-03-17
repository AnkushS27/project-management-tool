import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createTaskRequest,
  deleteTaskRequest,
  fetchTasksByProjectRequest,
  updateTaskRequest,
  type TaskPayload,
} from './tasksAPI';
import type { Task, TaskStatus } from '../../types';

interface TasksState {
  list: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (
    payload: { projectId: string; status?: TaskStatus },
    { rejectWithValue },
  ) => {
    try {
      return await fetchTasksByProjectRequest(payload.projectId, payload.status);
    } catch {
      return rejectWithValue('Failed to load tasks');
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (payload: TaskPayload, { rejectWithValue }) => {
    try {
      return await createTaskRequest(payload);
    } catch {
      return rejectWithValue('Failed to create task');
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    payload: { id: string; data: Partial<TaskPayload> },
    { rejectWithValue },
  ) => {
    try {
      return await updateTaskRequest(payload.id, payload.data);
    } catch {
      return rejectWithValue('Failed to update task');
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      return await deleteTaskRequest(id);
    } catch {
      return rejectWithValue('Failed to delete task');
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.list = state.list.map((task) =>
          task._id === action.payload._id ? action.payload : task,
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((task) => task._id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
