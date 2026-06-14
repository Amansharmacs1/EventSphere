import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' // default
  });

  const { name, email, password, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate(user?.role === 'admin' ? '/admin' : '/student');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    dispatch(register(formData));
  };

  return (
    <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-border-dark glass">
      <div className="text-center mb-8">
        <Link to="/" className="inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 mb-2">
          EventSphere
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Join us to start managing events.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <UserIcon size={20} />
            </div>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-border-dark rounded-xl bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-border-dark rounded-xl bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-border-dark rounded-xl bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={onChange}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Student</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={onChange}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Admin</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
