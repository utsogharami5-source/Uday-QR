import { Routes, Route, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import Scanner from './components/Scanner';
import Generator from './components/Generator';
import History from './components/History';
import { useUpdateChecker } from './hooks/useUpdateChecker';

function App() {
  const { isUpdateAvailable, latestVersion, downloadUrl, updateNotes } = useUpdateChecker();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background-light dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Auto-Update Banner */}
      {isUpdateAvailable && (
        <div className="absolute top-safe w-full z-50 px-4 pt-2 animate-in slide-in-from-top-4 duration-500 fade-in">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-primary/20 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined">system_update</span>
            </div>
            <h3 className="font-bold text-[15px]">Update Available v{latestVersion}</h3>
            {updateNotes && <p className="text-xs text-slate-500 mt-1 mb-3">{updateNotes}</p>}
            <a 
              href={downloadUrl || '#'} 
              target="_blank" rel="noopener noreferrer"
              className="mt-3 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              Download Update
            </a>
          </div>
        </div>
      )}

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
