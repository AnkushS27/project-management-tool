import * as path from 'path';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import mongoose, { Schema, model, type InferSchemaType } from 'mongoose';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed'],
      default: 'draft',
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    dueDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

type UserType = InferSchemaType<typeof userSchema>;
type ProjectType = InferSchemaType<typeof projectSchema>;
type TaskType = InferSchemaType<typeof taskSchema>;

const UserModel = model<UserType>('User', userSchema);
const ProjectModel = model<ProjectType>('Project', projectSchema);
const TaskModel = model<TaskType>('Task', taskSchema);

async function seed() {
  const mongoUri =
    process.env.MONGODB_URI ??
    'mongodb://localhost:27017/project_management_app';

  await mongoose.connect(mongoUri);

  await Promise.all([
    TaskModel.deleteMany({}),
    ProjectModel.deleteMany({}),
    UserModel.deleteMany({ email: 'test@example.com' }),
  ]);

  const hashedPassword = await bcrypt.hash('Test@123', 10);

  const user = await UserModel.create({
    email: 'test@example.com',
    password: hashedPassword,
  });

  const projects = await ProjectModel.insertMany([
    {
      title: 'Website Redesign',
      description: 'Revamp landing pages and improve user experience.',
      status: 'active',
      owner: user._id,
    },
    {
      title: 'Mobile App MVP',
      description: 'Build first release for Android and iOS.',
      status: 'draft',
      owner: user._id,
    },
  ]);

  const taskPayload = projects.flatMap((project, index) => [
    {
      title: `Planning Task ${index + 1}`,
      description: 'Define scope and acceptance criteria.',
      status: 'todo',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      project: project._id,
    },
    {
      title: `Execution Task ${index + 1}`,
      description: 'Implement prioritized backlog items.',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      project: project._id,
    },
    {
      title: `Review Task ${index + 1}`,
      description: 'Validate deliverables and close done items.',
      status: 'done',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      project: project._id,
    },
  ]);

  await TaskModel.insertMany(taskPayload as TaskType[]);

  console.log('Seed data created successfully');
  console.log('Credentials => email: test@example.com, password: Test@123');

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed', error);
  await mongoose.disconnect();
  process.exit(1);
});
