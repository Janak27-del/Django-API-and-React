import axios from 'axios';
import './App.css';
import { 
  Zap, 
  Trash2, 
  Edit3, 
  Star, 
  Layout, 
  Brain, 
  Trophy, 
  Command,
  Search,
  PlusCircle,
  MoreVertical,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api/tasks/';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', description: '', category: 'General', priority: 'medium', status: 'todo', is_starred: false 
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_BASE);
      setTasks(data);
    } catch (err) { console.error('Evolution Error:', err); }
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
      closeModal();
      fetchTasks();
    } catch (err) { console.error('Signal Failure:', err); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', category: 'General', priority: 'medium', status: 'todo', is_starred: false });
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormData(task);
    setShowModal(true);
  };

  const handleToggleStar = async (task) => {
    try {
      await axios.patch(`${API_BASE}${task.id}/`, { is_starred: !task.is_starred });
      fetchTasks();
    } catch (err) { console.error('Aether Synapse Error:', err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eradicate this signal from memory?')) return;
    try {
      await axios.delete(`${API_BASE}${id}/`);
      fetchTasks();
    } catch (err) { console.error('Eradication Failed:', err); }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo-box">A</div>
          <span>Aether AI</span>
        </div>
        <nav>
          <div className="nav-item active"><Brain size={18} /> <span>Neural Core</span></div>
          <div className="nav-item"><Layers size={18} /> <span>Category Nodes</span></div>
          <div className="nav-item"><Activity size={18} /> <span>Pulse Analytics</span></div>
          <div className="nav-item"><Trophy size={18} /> <span>Achievements</span></div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="header">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Access neural memory..." />
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <PlusCircle size={18} /> Sync New Signal
          </button>
        </header>

        <section className="content">
          <div className="welcome-msg">
            <h1>Intelligence Interface</h1>
            <p>Managing {tasks.length} active synaptic signals</p>
          </div>

          <div className="stats">
            <div className="stat-card"><h3>Active Cycles</h3><p>{tasks.filter(t => t.status !== 'completed').length}</p></div>
            <div className="stat-card"><h3>Starred Signals</h3><p>{tasks.filter(t => t.is_starred).length}</p></div>
            <div className="stat-card"><h3>Processing</h3><p>{tasks.filter(t => t.status === 'in_progress').length}</p></div>
            <div className="stat-card"><h3>Neural Load</h3><p>{tasks.length > 5 ? 'High' : 'Stable'}</p></div>
          </div>

          <div className="dashboard-grid">
            <div className="signals-section">
              <div className="section-head">
                <h2>Signal Stream</h2>
                <div className="filters">Sorted by Relevance <ChevronRight size={14} /></div>
              </div>

              {loading ? <div className="loader">Calibrating Aether...</div> : (
                tasks.map(task => (
                  <div key={task.id} className="signal-card">
                    <div className="signal-main">
                      <button className={`star-btn ${task.is_starred ? 'active' : ''}`} onClick={() => handleToggleStar(task)}>
                        <Star size={18} fill={task.is_starred ? 'currentColor' : 'none'} />
                      </button>
                      <div className="signal-content">
                        <span className="category">{task.category}</span>
                        <h4 className={task.status === 'completed' ? 'strike' : ''}>{task.title}</h4>
                        <p>{task.description}</p>
                      </div>
                    </div>
                    <div className="signal-meta">
                      <div className={`priority-dot ${task.priority}`} />
                      <div className="task-actions">
                        <button onClick={() => openEdit(task)}><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(task.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="side-dash">
              <div className="stat-card glass" style={{ marginBottom: '24px' }}>
                <h3>Pulse Rate</h3>
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <Zap size={48} color="var(--primary)" />
                  <p style={{ fontSize: '1.2rem', marginTop: '12px' }}>Accelerating</p>
                </div>
              </div>
              <div className="stat-card glass">
                <h3>Focus Nodes</h3>
                <ul style={{ listStyle: 'none', padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                  <li style={{ marginBottom: '8px' }}>• Core Development</li>
                  <li style={{ marginBottom: '8px' }}>• Neural Mapping</li>
                  <li>• System Optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal / Synchronizer */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTask ? 'Optimize Signal' : 'Initiate New Signal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Signal Header</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Initialize Subsystem Alpha" />
              </div>
              <div className="form-group">
                <label>Domain / Category</label>
                <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Cognitive, Structural, Logic" />
              </div>
              <div className="form-group">
                <label>Signal Parameters (Description)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" />
              </div>
              <div className="row" style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Criticality (Priority)</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Phase (Status)</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="todo">Pending</option>
                    <option value="in_progress">Active</option>
                    <option value="completed">Synced</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={closeModal}>Abort</button>
                <button type="submit" className="save-btn">{editingTask ? 'Re-align' : 'Synchronize'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
