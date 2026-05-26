import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- Added Link here
import { api } from '../../services/api';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Send credentials to backend
      const response = await api.login(credentials);
      
      // 2. Save the resulting JWT token in the browser's Local Storage
      localStorage.setItem('adminToken', response.token);
      
      // 3. Redirect to the admin dashboard
      navigate('/admin'); 
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
          Admin Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Authorized personnel only.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm font-semibold border border-red-200">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1">
                <input 
                  type="text" 
                  name="username" 
                  required 
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input 
                  type="password" 
                  name="password" 
                  required 
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" 
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#003060]'
                }`}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
        
        {/* NEW: Back to Homepage Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors inline-flex items-center space-x-1"
          >
            <span>&larr;</span>
            <span>Return to Public Website</span>
          </Link>
        </div>

      </div>
    </div>
  );
}