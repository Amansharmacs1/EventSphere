const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-border-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
        <p className="mt-2 text-sm">Plan, Manage and Attend College Events Seamlessly.</p>
      </div>
    </footer>
  );
};

export default Footer;
