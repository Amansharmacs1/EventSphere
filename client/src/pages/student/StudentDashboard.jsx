import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRecommendations } from '../../features/events/eventSlice';
import { Link } from 'react-router-dom';
import { Calendar, Loader2, Sparkles } from 'lucide-react';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recommendations, isLoading } = useSelector((state) => state.event);
  const [stats, setStats] = useState({ registeredEvents: '--', certificatesEarned: '--' });

  useEffect(() => {
    dispatch(getRecommendations());
    
    const fetchStats = async () => {
      try {
        const { data } = await import('axios').then(m => m.default).then(axios => axios.get('/api/users/stats', { withCredentials: true }));
        if (data && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    
    fetchStats();
  }, [dispatch]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <h1 className="text-3xl font-bold mb-2 relative z-10">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-primary-100 opacity-90 relative z-10">Ready to discover your next big event?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles className="text-yellow-500" />
              AI Recommended Events
            </h2>
            <Link to="/student/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Browse All
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          ) : recommendations.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {recommendations.map((event) => (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  key={event._id} 
                  className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
                >
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
                    <img src={event.banner !== 'no-photo.jpg' ? event.banner : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} alt={event.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs font-semibold text-primary-600 mb-2">{event.category}</div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
                    <Link to={`/student/events/${event._id}`} className="w-full inline-flex justify-center items-center px-4 py-2 bg-primary-50 hover:bg-primary-600 hover:text-white dark:bg-primary-900/20 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white rounded-lg transition-colors text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
             <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark p-8 text-center">
               <p className="text-gray-500 dark:text-gray-400">No recommendations available right now. Check back later!</p>
             </div>
          )}
        </div>

        {/* Right Column: Quick Stats / Upcoming */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-border-dark p-6 shadow-sm">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                 <div className="flex items-center gap-3">
                   <Calendar className="text-primary-600" />
                   <span className="text-gray-700 dark:text-gray-300">Registered Events</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{stats.registeredEvents}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                 <div className="flex items-center gap-3">
                   <Sparkles className="text-green-600" />
                   <span className="text-gray-700 dark:text-gray-300">Certificates Earned</span>
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">{stats.certificatesEarned}</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
