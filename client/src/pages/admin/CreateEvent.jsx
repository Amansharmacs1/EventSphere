import { useState } from 'react';
import axios from 'axios';
import { Sparkles, Calendar, Clock, MapPin, Users, Loader2, Image as ImageIcon, Tag, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '',
    time: '',
    venue: '',
    maxSeats: '',
    speaker: '',
    banner: '',
    registrationDeadline: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { title, description, category, date, time, venue, maxSeats, speaker, banner, registrationDeadline } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    setIsUploading(true);

    try {
      const response = await axios.post('/api/upload', uploadData, {
        withCredentials: true
      });
      setFormData((prev) => ({ ...prev, banner: response.data.url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const generateAIDescription = async () => {
    if (!title || !category || !speaker) {
      toast.error('Please enter Title, Category, and Speaker to generate AI description');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/events/ai-description', {
        title,
        category,
        speaker
      }, { withCredentials: true });
      
      setFormData(prev => ({ ...prev, description: response.data.data }));
      toast.success('AI description generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate AI description');
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you might upload the file first to a service like Cloudinary,
      // but for this implementation we will accept a banner URL to keep it simple,
      // or simply rely on the backend accepting it if it's set up that way.
      // Set status to Published so it shows up
      const payload = { ...formData, status: 'Published' };
      await axios.post('/api/events', payload, { withCredentials: true });
      toast.success('Event created successfully!');
      // Reset form
      setFormData({
        title: '', description: '', category: 'Technology', date: '', time: '', venue: '', maxSeats: '', speaker: '', banner: '', registrationDeadline: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Publish a new event for students to register.</p>
      </div>

      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-border-dark">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="E.g., Intro to Machine Learning"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <select
                  name="category"
                  value={category}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                  <option value="Science">Science</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Speaker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Speaker / Host</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="speaker"
                  value={speaker}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Description (Full width) */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={isGenerating}
                  className="text-sm flex items-center text-primary-600 hover:text-primary-700 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin mr-1" /> : <Sparkles size={16} className="mr-1" />}
                  Generate with AI
                </button>
              </div>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Detailed description of the event..."
              ></textarea>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="time"
                  name="time"
                  value={time}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Venue</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="text"
                  name="venue"
                  value={venue}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Main Auditorium"
                />
              </div>
            </div>

            {/* Max Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Seats</label>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="number"
                  name="maxSeats"
                  value={maxSeats}
                  onChange={onChange}
                  required
                  min="1"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banner Image</label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-border-dark border-dashed rounded-xl bg-gray-50 dark:bg-background-dark hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors relative">
                {isUploading ? (
                  <div className="flex flex-col items-center py-8">
                    <Loader2 className="animate-spin text-primary-600 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Uploading image...</p>
                  </div>
                ) : banner ? (
                  <div className="relative w-full">
                    <img src={banner} alt="Banner Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, banner: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Registration Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <input
                  type="date"
                  name="registrationDeadline"
                  value={registrationDeadline}
                  onChange={onChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-border-dark bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
