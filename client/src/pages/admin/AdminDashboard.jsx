import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents, deleteEvent } from '../../features/events/eventSlice';
import { Users, Calendar, CheckCircle, Award, Loader2, TrendingUp, BarChart2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark flex items-center space-x-4">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  
  const dispatch = useDispatch();
  const { events, isLoading: isEventsLoading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getEvents());

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('/api/admin/analytics', { withCredentials: true });
        setAnalytics(response.data.data);
      } catch (error) {
        toast.error('Failed to load analytics');
        console.error(error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [dispatch]);

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        toast.success('Event deleted successfully');
        // Refresh analytics after deletion
        const response = await axios.get('/api/admin/analytics', { withCredentials: true });
        setAnalytics(response.data.data);
      } catch (error) {
        toast.error(error || 'Failed to delete event');
      }
    }
  };

  if (isLoadingAnalytics || isEventsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Overview of your events and student registrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={analytics.totalStudents} 
          icon={Users} 
          colorClass="bg-blue-500" 
        />
        <StatCard 
          title="Total Events" 
          value={analytics.totalEvents} 
          icon={Calendar} 
          colorClass="bg-indigo-500" 
        />
        <StatCard 
          title="Today's Registrations" 
          value={analytics.todaysRegistrations} 
          icon={CheckCircle} 
          colorClass="bg-emerald-500" 
        />
        <StatCard 
          title="Certificates Issued" 
          value={analytics.totalCertificates} 
          icon={Award} 
          colorClass="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Events */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="mr-2 text-primary-500" size={20} />
              Popular Events
            </h2>
          </div>
          <div className="space-y-4">
            {analytics.popularEvents?.length > 0 ? (
              analytics.popularEvents.map((event) => (
                <div key={event._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{event.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{event.registeredCount} / {event.maxSeats}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Registrations</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No popular events to show.</p>
            )}
          </div>
        </div>

        {/* Category Distribution (Simple visualization) */}
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart2 className="mr-2 text-primary-500" size={20} />
              Event Categories
            </h2>
          </div>
          <div className="space-y-4">
            {analytics.categoryDistribution?.length > 0 ? (
              analytics.categoryDistribution.map((cat) => (
                <div key={cat._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{cat._id}</span>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
                    {cat.count} Events
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No categories found.</p>
            )}
          </div>
        </div>
      </div>

      {/* All Events Table with Delete */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-border-dark">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-2 text-primary-500" size={20} />
            Manage All Events
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-background-dark border-b border-gray-100 dark:border-border-dark">
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Event Title</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-border-dark">
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-background-dark/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{event.title}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{event.category}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
