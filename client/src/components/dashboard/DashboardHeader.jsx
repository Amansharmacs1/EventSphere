import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="h-20 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-border-dark flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {user?.role === 'admin' ? 'Admin Hub' : 'Student Portal'}
        </h2>
      </div>
      
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toast('No new notifications', { icon: '🔔' })}
          className="text-gray-500 hover:text-primary-600 transition-colors relative"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </motion.button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-border-dark">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-800">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2"
          title="Logout"
        >
          <LogOut size={20} />
        </motion.button>
      </div>
    </header>
  );
};

export default DashboardHeader;
