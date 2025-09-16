import AdminDashboard from '../AdminDashboard';

export default function AdminDashboardExample() {
  return (
    <AdminDashboard onStartGame={() => console.log('Game started from example')} />
  );
}