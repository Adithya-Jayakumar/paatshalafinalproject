import React, { useEffect, useState } from 'react';
import API from './api';
import TaskForm from './components/taskForm';
import TaskList from './components/taskList';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'All') params.status = filterStatus;
      if (search.trim()) params.search = search.trim();
      const res = await API.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filterStatus, search]);

  const addTask = async (taskData) => {
    try {
      const res = await API.post('/tasks', taskData);
      setTasks(prev => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to add task');
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await API.put(`/tasks/${id}`, updates);
      setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      if (!confirm('Are you sure you want to delete this task?')) return;
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;

  return (
    <div className="container">
      <h1 className="mb-4">Task Manager</h1>

      <div className="row mb-3">
        <div className="col-md-6">
          <TaskForm onAdd={addTask} />
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>Filter</strong>
                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>

              <div style={{ width: 200 }}>
                <input className="form-control" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div>
              <small>Completed: {completedCount}</small> · <small>Pending: {pendingCount}</small>
            </div>
          </div>
        </div>
      </div>

      <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} loading={loading} />
    </div>
  );
}
