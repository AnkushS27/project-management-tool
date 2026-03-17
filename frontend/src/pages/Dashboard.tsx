import ProjectsPage from '../features/projects/ProjectsPage';

export default function Dashboard() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <ProjectsPage />
    </section>
  );
}
