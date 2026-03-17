import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Project {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ enum: Object.values(ProjectStatus), default: ProjectStatus.DRAFT })
  status!: ProjectStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;

  createdAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
