import { Routes, Route, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import Scanner from './components/Scanner';
import Generator from './components/Generator';
import History from './components/History';

function App() {
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background-light dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 relative overflow-hidden">
        <Routes>
          <Route path="/" element={<Scanner />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="relative z-50 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-300 pb-safe">
        <div className="flex justify-between items-center px-6 py-3">
          <NavItem to="/" icon="center_focus_weak" label="Scan" />
          <NavItem to="/generator" icon="add_circle" label="Create" />
          <NavItem to="/history" icon="history" label="Activity" />
          <button onClick={() => alert('Settings coming soon!')} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 transition-colors w-16">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
          </button>
        </div>
        {/* iOS Bottom Home Bar Spacer */}
        <div className="h-4 flex justify-center items-end pb-2">
          <div className="w-32 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full"></div>
        </div>
      </nav>
    </div>
  )
}

function NavItem({ to, icon, label }: { to: string, icon: string, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "flex flex-col items-center gap-1 transition-colors w-16",
        isActive ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
      )}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </NavLink>
  );
}

export default App;
