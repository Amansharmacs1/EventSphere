import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Settings, 
  PlusCircle, 
  Users, 
  ScanLine 
} from 'lucide-react';

const Sidebar = ({ role }) => {
  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={20} /> },
    { name: 'Browse Events', path: '/student/events', icon: <Calendar size={20} /> },
    { name: 'My Tickets', path: '/student/tickets', icon: <Ticket size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Create Event', path: '/admin/events/create', icon: <PlusCircle size={20} /> },
    { name: 'Registrations', path: '/admin/registrations', icon: <Users size={20} /> },
    { name: 'Scan QR', path: '/admin/scan', icon: <ScanLine size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-border-dark flex flex-col transition-all duration-300 z-10">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-border-dark">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          EventSphere
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === '/student' || link.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
