import axios from 'axios';
import './App.css';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Circle, 
  LayoutDashboard, 
  CheckSquare, 
  AlertCircle,
  MoreVertical,
  Search,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api/tasks/';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', status: 'todo' });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_BASE);
      setTasks(data);
    } catch (err) { console.error('Error fetching tasks:', err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`${API_BASE}${editingTask.id}/`, formData);
      } else {
        await axios.post(API_BASE, formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo' });
      fetchTasks();
    } catch (err) { console.error('Error saving task:', err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_BASE}${id}/`);
      fetchTasks();
    } catch (err) { console.error('Error deleting task:', err); }
  };

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
    try {
      await axios.patch(`${API_BASE}${task.id}/`, { status: nextStatus });
      fetchTasks();
    } catch (err) { console.error('Error toggling status:', err); }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box">N</div>
          <span>Nexus Hub</span>
        </div>
        <nav>
          <div className="nav-item active"><LayoutDashboard size={20} /> <span>Dashboard</span></div>
          <div className="nav-item"><CheckSquare size={20} /> <span>Tasks</span></div>
          <div className="nav-item"><AlertCircle size={20} /> <span>Priorities</span></div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="header">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search tasks..." />
          </div>
          <button className="add-btn" onClick={() => { setShowModal(true); setEditingTask(null); setFormData({ title: '', description: '', priority: 'medium', status: 'todo' }); }}>
            <Plus size={18} /> New Task
          </button>
        </header>

        <section className="content">
          <div className="stats">
            <div className="stat-card"><h3>Total Tasks</h3><p>{tasks.length}</p></div>
            <div className="stat-card"><h3>Completed</h3><p>{tasks.filter(t => t.status === 'completed').length}</p></div>
            <div className="stat-card"><h3>Needs Focus</h3><p>{tasks.filter(t => t.priority === 'high').length}</p></div>
          </div>

          <div className="task-list">
            <div className="list-header">
              <h2>My Workstream</h2>
              <div className="view-selector">Sort by: <span>Date</span> <ChevronDown size={14} /></div>
            </div>

            {loading ? <div className="loader">Refreshing Nexus...</div> : (
              tasks.map(task => (
                <div key={task.id} className={`task-card ${task.status}`}>
                  <div className="task-main">
                    <button className="status-btn" onClick={() => toggleStatus(task)}>
                      {task.status === 'completed' ? <CheckCircle className="checked" /> : <Circle className="unchecked" />}
                    </button>
                    <div className="task-info">
                      <h4 className={task.status === 'completed' ? 'strike' : ''}>{task.title}</h4>
                      <p>{task.description}</p>
                    </div>
                  </div>
                  <div className="task-meta">
                    <span className={`priority-tag ${task.priority}`}>{task.priority}</span>
                    <div className="task-actions">
                      <button onClick={() => openEdit(task)}><Edit3 size={16} /></button>
                      <button className="delete" onClick={() => handleDelete(task.id)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTask ? 'Refine Objective' : 'New Objective'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Objective Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Design System Phase 1" />
              </div>
              <div className="field">
                <label>Context / Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Briefly describe the task..." />
              </div>
              <div className="row">
                <div className="field">
                  <label>Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="field">
                  <label>Initial Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">{editingTask ? 'Update' : 'Deploy'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
