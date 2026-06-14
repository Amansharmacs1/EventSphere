import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTickets } from '../../features/tickets/ticketSlice';
import { Loader2, Ticket as TicketIcon, CheckCircle, Download, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MyTickets = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector((state) => state.ticket);

  useEffect(() => {
    dispatch(getMyTickets());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      <div className="text-center sm:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">My VIP Passes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">View and manage your exclusive event tickets.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-[#d4af37]" size={48} />
        </div>
      ) : tickets.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-10 items-center w-full"
        >
          {tickets.map((ticket) => (
            <motion.div 
              key={ticket._id} 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden transition-transform duration-300"
            >
              
              {/* Ticket Left Side (Dark Theme 70%) */}
              <div className="w-full sm:w-[70%] bg-[#1a1a1a] text-white p-6 md:p-8 relative flex flex-col justify-between border-b sm:border-b-0 sm:border-r-4 border-dashed border-[#d4af37]">
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                    ticket.status === 'Active' ? 'bg-[#d4af37] text-black' :
                    ticket.status === 'Used' ? 'bg-gray-700 text-gray-300' :
                    'bg-red-500 text-white'
                  }`}>
                    {ticket.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-[#d4af37] font-semibold tracking-widest text-sm mb-2 uppercase">{ticket.event.category || 'Event Ticket'}</h4>
                  <h2 className="text-4xl md:text-5xl font-black uppercase mb-1 leading-tight">{ticket.event.title}</h2>
                  <h3 className="text-xl font-bold tracking-widest uppercase text-gray-300 mb-6">Admit One</h3>
                  
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-semibold text-lg">{new Date(ticket.event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Time</p>
                      <p className="font-semibold text-lg">{ticket.event.time || 'TBA'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Venue</p>
                      <p className="font-semibold text-lg">{ticket.event.venue || 'TBA'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-end">
                  {/* CSS Mock Barcode */}
                  <div className="flex flex-col">
                    <div className="h-10 w-48 flex items-end overflow-hidden opacity-70">
                      {/* Generating a repeating linear gradient to simulate barcode lines */}
                      <div className="w-full h-full bg-[linear-gradient(90deg,#fff_1px,transparent_1px,#fff_3px,transparent_3px,#fff_4px,transparent_4px,#fff_6px,transparent_6px,#fff_7px,transparent_7px,#fff_9px,transparent_9px,#fff_12px,transparent_12px,#fff_15px,transparent_15px,#fff_18px,transparent_18px,#fff_20px,transparent_20px,#fff_22px,transparent_22px)] bg-[length:24px_100%] border-b border-white"></div>
                    </div>
                    <p className="font-mono text-xs mt-1 text-gray-500 tracking-widest">ID: {ticket.ticketId}</p>
                  </div>
                  
                  {ticket.checkedIn && (
                    <span className="flex items-center text-sm font-medium text-[#d4af37]">
                      <CheckCircle size={16} className="mr-2" /> Checked In
                    </span>
                  )}
                </div>
              </div>

              {/* Ticket Right Side (Light Stub 30%) */}
              <div className="w-full sm:w-[30%] bg-white text-black p-6 md:p-8 flex flex-col justify-between items-center relative">
                {/* Cutout half-circles for realistic ticket look */}
                <div className="absolute -left-3 top-[-10px] w-6 h-6 bg-gray-50 dark:bg-background-dark rounded-full hidden sm:block"></div>
                <div className="absolute -left-3 bottom-[-10px] w-6 h-6 bg-gray-50 dark:bg-background-dark rounded-full hidden sm:block"></div>

                <div className="text-center w-full">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{ticket.event.category || 'Event'}</h4>
                  <h3 className="text-xl font-black uppercase text-[#d4af37] mb-6">TICKET</h3>
                  
                  <div className="space-y-3 text-left w-full max-w-[200px] mx-auto mb-6">
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Type</span>
                      <span className="text-sm font-bold truncate ml-2">General</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Date</span>
                      <span className="text-sm font-bold truncate ml-2">{new Date(ticket.event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Time</span>
                      <span className="text-sm font-bold truncate ml-2">{ticket.event.time || 'TBA'}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-xs text-gray-500 font-semibold uppercase">Status</span>
                      <span className="text-sm font-bold truncate ml-2">{ticket.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center w-full">
                   <div className="p-2 border-2 border-gray-100 rounded-xl mb-4 w-28 h-28 flex items-center justify-center">
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.ticketId}`} alt="QR Code" className="w-full h-full object-contain" />
                   </div>

                   {/* Actions */}
                   <div className="w-full space-y-2">
                     {ticket.status === 'Active' && (
                       <button 
                         onClick={() => {
                           const baseURL = axios.defaults.baseURL || '';
                           window.open(`${baseURL}/api/tickets/${ticket._id}/download`, '_blank');
                         }}
                         className="w-full flex justify-center items-center py-2.5 bg-[#1a1a1a] hover:bg-black text-white rounded-lg font-bold transition-colors text-sm uppercase tracking-wider"
                       >
                         <Download size={16} className="mr-2" /> Download
                       </button>
                     )}
                     
                     {ticket.status === 'Used' && ticket.certificateUrl && (
                       <button 
                         onClick={() => {
                           const baseURL = axios.defaults.baseURL || '';
                           const certUrl = ticket.certificateUrl.startsWith('http') ? ticket.certificateUrl : `${baseURL}${ticket.certificateUrl}`;
                           window.open(certUrl, '_blank');
                         }}
                         className="w-full flex justify-center items-center py-2.5 bg-[#d4af37] hover:bg-[#b8962c] text-black rounded-lg font-bold transition-colors text-sm uppercase tracking-wider"
                       >
                         <Award size={16} className="mr-2" /> Certificate
                       </button>
                     )}

                     {ticket.status === 'Cancelled' && (
                       <button disabled className="w-full py-2.5 bg-gray-200 text-gray-400 rounded-lg font-bold text-sm uppercase tracking-wider cursor-not-allowed">
                         Cancelled
                       </button>
                     )}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-surface-dark p-12 rounded-3xl border border-gray-100 dark:border-border-dark text-center shadow-lg"
        >
          <TicketIcon size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-2">No tickets yet</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't registered for any events, or your registrations are pending approval.</p>
          <a href="/student/events" className="inline-flex items-center px-8 py-3 bg-[#d4af37] hover:bg-[#b8962c] text-black rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md">
            Browse Events
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyTickets;
