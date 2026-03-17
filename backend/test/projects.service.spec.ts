import { ProjectsService } from '../src/projects/projects.service';

describe('ProjectsService', () => {
  it('should be defined', () => {
    const service = new ProjectsService({} as never);
    expect(service).toBeDefined();
  });
});
