import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const linkClass = (path) => `flex items-center w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${location.pathname === path ? 'bg-slate-700 text-indigo-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`;

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col z-10">
      <h1 className="text-xl font-black text-white mb-8 tracking-tight flex items-center">
        <span className="material-symbols-outlined text-indigo-500 mr-2 text-3xl">meeting_room</span> ClassMonitor
      </h1>
      <nav className="flex-1">
        <Link to="/" className={linkClass('/')}>
          <span className="material-symbols-outlined mr-2">dashboard</span> Dashboard
        </Link>
        <Link to="/admin" className={linkClass('/admin')}>
          <span className="material-symbols-outlined mr-2">manage_accounts</span> Roster Setup
        </Link>
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-800 text-sm text-slate-500 flex items-center">
        <span className="material-symbols-outlined mr-2 text-lg">admin_panel_settings</span> Admin Mode
      </div>
    </div>
  );
}
