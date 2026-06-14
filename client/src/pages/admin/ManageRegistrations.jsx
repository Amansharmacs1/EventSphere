import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedEvent(response.data.data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;

    const fetchRegistrations = async () => {
      setIsLoadingRegs(true);
      try {
        const response = await axios.get(`/api/registrations/event/${selectedEvent}`, {
          withCredentials: true,
        });
        setRegistrations(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch registrations');
      } finally {
        setIsLoadingRegs(false);
      }
    };

    fetchRegistrations();
  }, [selectedEvent]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/registrations/${id}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Registration ${status} successfully`);
      
      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? { ...reg, status } : reg))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (isLoadingEvents) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Registrations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Approve or reject student applications.</p>
        </div>

        <div className="w-full md:w-72">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
          >
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark overflow-hidden">
        {isLoadingRegs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary-600" size={30} />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No registrations found for this event.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-background-dark border-b border-gray-200 dark:border-border-dark">
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Student</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Date Applied</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-border-dark">
                {registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-gray-50 dark:hover:bg-background-dark/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{reg.student.name}</div>
                      <div className="text-sm text-gray-500">{reg.student.branch || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {reg.student.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${reg.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : ''}
                        ${reg.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
                        ${reg.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : ''}
                      `}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {reg.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => updateStatus(reg._id, 'Approved')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => updateStatus(reg._id, 'Rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRegistrations;
