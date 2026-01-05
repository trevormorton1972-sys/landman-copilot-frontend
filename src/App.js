import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Search, CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';

const LandmanCopilot = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiUrl] = useState('https://api.landmancopilot.ai/api');
  const [formData, setFormData] = useState({
    partyName: '',
    partyRole: 'both',
    dateFrom: '2016-04-10',
    dateTo: new Date().toISOString().split('T')[0],
    legalDescription: '',
    priority: 5,
    notes: '',
    portalId: 1,
    countyId: 1,
  });

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchTasks();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${apiUrl}/search-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/search-tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.task) {
        setTasks([data.task, ...tasks]);
        setShowCreateForm(false);
        setFormData({
          partyName: '',
          partyRole: 'both',
          dateFrom: '2016-04-10',
          dateTo: new Date().toISOString().split('T')[0],
          legalDescription: '',
          priority: 5,
          notes: '',
          portalId: 1,
          countyId: 1,
        });
      }
    } catch (error) {
      alert('Failed to create task: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTasks([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'queued':
        return 'bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Landman
              </h1>
              <p className="text-gray-500 mt-2 font-medium">AI-Powered Title Research</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="test@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Demo credentials: test@example.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Landman</h1>
            <p className="text-sm text-gray-500">Title Research Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Create Task Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-bold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Search Task
          </button>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Search Task</h2>
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Party Name *
                </label>
                <input
                  type="text"
                  value={formData.partyName}
                  onChange={(e) =>
                    setFormData({ ...formData, partyName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Apache Deepwater LLC"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Party Role
                </label>
                <select
                  value={formData.partyRole}
                  onChange={(e) =>
                    setFormData({ ...formData, partyRole: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="both">Both</option>
                  <option value="grantor">Grantor</option>
                  <option value="grantee">Grantee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date From
                </label>
                <input
                  type="date"
                  value={formData.dateFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, dateFrom: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date To
                </label>
                <input
                  type="date"
                  value={formData.dateTo}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTo: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Legal Description
                </label>
                <textarea
                  value={formData.legalDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, legalDescription: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E2W2 of Section 2, John Eiche Survey, A-195"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{formData.priority}</span>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Search className="w-6 h-6" />
            Search Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 text-lg">No search tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border-l-4 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition ${getStatusColor(
                    task.status
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(task.status)}
                        <h3 className="text-lg font-bold text-slate-900">
                          {task.party_name}
                        </h3>
                        <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                          {task.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {task.legal_description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Role:</span>
                          <p className="font-semibold text-gray-900">{task.party_role}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Priority:</span>
                          <p className="font-semibold text-gray-900">{task.priority}/10</p>
                        </div>
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="font-semibold text-gray-900">
                            {new Date(task.date_from).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <p className="font-semibold text-gray-900">
                            {new Date(task.date_to).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandmanCopilot;

