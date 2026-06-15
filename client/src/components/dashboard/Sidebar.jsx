import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  PlusCircle, 
  Users, 
  ScanLine,
  X
} from 'lucide-react';

const Sidebar = ({ role, isOpen, setIsOpen }) => {
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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-border-dark flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-border-dark">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            EventSphere
          </span>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
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
    </>
  );
};

export default Sidebar;
