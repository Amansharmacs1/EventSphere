import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../../features/events/eventSlice';
import { Search, Filter, Loader2, Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const BrowseEvents = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.event);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    return matchesSearch && matchesCategory && event.status === 'Published';
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Events</h1>
          <p className="text-gray-500 dark:text-gray-400">Find and register for upcoming events on campus.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      ) : filteredEvents.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event) => (
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              key={event._id} 
              className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.banner !== 'no-photo.jpg' ? event.banner : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-md text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="mr-2 text-primary-500" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="mr-2 text-primary-500" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users size={16} className="mr-2 text-primary-500" />
                    <span>{event.registeredCount} / {event.maxSeats} Registered</span>
                  </div>
                </div>
                
                <Link 
                  to={`/student/events/${event._id}`}
                  className="w-full block text-center py-3 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white rounded-xl font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-surface-dark p-12 rounded-2xl border border-gray-100 dark:border-border-dark text-center">
          <Calendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseEvents;
