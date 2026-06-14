import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getEvent } from '../../features/events/eventSlice';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { event, isLoading, isError, message } = useSelector((state) => state.event);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    dispatch(getEvent(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h2>
        <p className="text-red-500 mt-2">{message}</p>
        <Link to="/student/events" className="text-primary-600 hover:underline mt-4 inline-block">Back to Events</Link>
      </div>
    );
  }

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await axios.post(`/api/registrations/${id}`, {}, { withCredentials: true });
      toast.success('Successfully registered! Waiting for admin approval to generate ticket.', { duration: 5000 });
      // Optionally reload the event to update registered count
      dispatch(getEvent(id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsRegistering(false);
    }
  };

  const formatInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const formatMarkdown = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      if (line.trim() === '') return <br key={idx} />;
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{formatInline(line.replace('### ', ''))}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold mt-5 mb-2 text-gray-900 dark:text-white">{formatInline(line.replace('## ', ''))}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-3xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">{formatInline(line.replace('# ', ''))}</h1>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-6 list-disc mb-1">{formatInline(line.slice(2))}</li>;
      }
      return <p key={idx} className="mb-3">{formatInline(line)}</p>;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      <Link to="/student/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
        <ArrowLeft size={18} className="mr-2" />
        Back to Events
      </Link>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark overflow-hidden">
        <div className="h-64 md:h-96 w-full relative">
          <img 
            src={event.banner !== 'no-photo.jpg' ? event.banner : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 pr-6">
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full shadow-lg mb-3 inline-block">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About this Event</h2>
              <div className="text-gray-600 dark:text-gray-300">
                {formatMarkdown(event.description)}
              </div>
            </div>
            
            {event.speaker && (
              <div className="bg-gray-50 dark:bg-background-dark p-6 rounded-xl border border-gray-100 dark:border-border-dark flex items-center gap-4">
                <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Main Speaker</h3>
                  <p className="text-gray-600 dark:text-gray-400">{event.speaker}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-background-dark p-6 rounded-xl border border-gray-100 dark:border-border-dark space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-border-dark pb-2">Event Details</h3>
              
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <Calendar className="text-primary-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <Clock className="text-primary-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="text-primary-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Venue</p>
                  <p className="text-sm">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                <Users className="text-primary-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-sm">{event.registeredCount} / {event.maxSeats} Registered</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {isRegistering ? <Loader2 size={24} className="animate-spin" /> : 'Register for Event'}
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Registration closes on {new Date(event.registrationDeadline).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
