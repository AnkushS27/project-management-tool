import { Link, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <BriefcaseBusiness size={20} />
          <span>Project Management</span>
        </Link>
        {token ? (
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
