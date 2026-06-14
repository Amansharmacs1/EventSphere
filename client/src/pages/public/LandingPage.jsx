import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Ticket, Award, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-background-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-background-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Plan, Manage and Attend <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              College Events Seamlessly
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
          >
            The ultimate platform for students and administrators to discover, register, and manage college events with QR ticketing and AI recommendations.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
              Get Started Now <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-surface-dark dark:hover:bg-gray-800 transition-all">
              Login to Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything you need</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">A complete suite of tools for event management.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Calendar size={32} />, title: "Discover Events", desc: "Find the best college events tailored to your interests." },
              { icon: <Ticket size={32} />, title: "QR Ticketing", desc: "Instant PDF tickets with QR codes for seamless check-ins." },
              { icon: <Award size={32} />, title: "Certificates", desc: "Automatically receive certificates upon event completion." },
              { icon: <Users size={32} />, title: "Admin Dashboard", desc: "Powerful analytics and management tools for organizers." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
