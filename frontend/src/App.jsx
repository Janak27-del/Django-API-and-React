import axios from 'axios';
import './App.css';
import { 
  Zap, 
  Trash2, 
  Edit3, 
  Star, 
  Brain, 
  Search,
  PlusCircle,
  Activity,
  Layers,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Circle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000/api/tasks/';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
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
    } catch (err) { console.error('Aether Synapse Error:', err); }
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
    } catch (err) { console.error('Signal Error:', err); }
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
    } catch (err) { console.error('Star Fail:', err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eradicate signal?')) return;
    try {
      await axios.delete(`${API_BASE}${id}/`);
      fetchTasks();
    } catch (err) { console.error('Deletion Fail:', err); }
  };

  const KanbanColumn = ({ status, label }) => {
    const colTasks = tasks.filter(t => t.status === status);
    return (
      <div className="kanban-col">
        <div className="col-header">
          <span>{label}</span>
          <span className="col-count">{colTasks.length}</span>
        </div>
        {colTasks.map(task => (
          <div key={task.id} className="kanban-card">
            <div className="kb-head">
              <span className="kb-tag">{task.category}</span>
              <button className={`star-btn ${task.is_starred ? 'active' : ''}`} onClick={() => handleToggleStar(task)}>
                <Star size={14} fill={task.is_starred ? 'currentColor' : 'none'} />
              </button>
            </div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="kb-meta">
              <div className={`priority-dot ${task.priority}`} />
              <div className="task-actions">
                <button onClick={() => openEdit(task)}><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(task.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
          <div className="nav-item"><Layers size={18} /> <span>Nodes</span></div>
          <div className="nav-item"><Activity size={18} /> <span>Pulse</span></div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="header">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Access synaptic memory..." />
          </div>
          <div className="header-actions">
            <div className="toggle-group" style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
              <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} style={{ padding: '6px 12px', border: 'none', background: viewMode === 'list' ? 'rgba(6,182,212,0.1)' : 'transparent', color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-dim)', borderRadius: '8px' }}>
                <ListIcon size={18} />
              </button>
              <button className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')} style={{ padding: '6px 12px', border: 'none', background: viewMode === 'kanban' ? 'rgba(6,182,212,0.1)' : 'transparent', color: viewMode === 'kanban' ? 'var(--primary)' : 'var(--text-dim)', borderRadius: '8px' }}>
                <LayoutGrid size={18} />
              </button>
            </div>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              <PlusCircle size={18} /> Link Signal
            </button>
          </div>
        </header>

        <section className="content">
          <div className="stats">
            <div className="stat-card"><h3>Neural Synapses</h3><p>{tasks.length}</p></div>
            <div className="stat-card"><h3>Priority Stars</h3><p>{tasks.filter(t => t.is_starred).length}</p></div>
            <div className="stat-card"><h3>Processing</h3><p>{tasks.filter(t => t.status === 'in_progress').length}</p></div>
            <div className="stat-card"><h3>Synced</h3><p>{tasks.filter(t => t.status === 'completed').length}</p></div>
          </div>

          <div className="view-container">
            {loading ? <div className="loader">Synchronizing Aether...</div> : (
              viewMode === 'list' ? (
                <div className="signals-list">
                  <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2>Neural Stream</h2>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{tasks.length} active threads</span>
                  </div>
                  {tasks.map(task => (
                    <div key={task.id} className="signal-card">
                      <div className="signal-main">
                        <button className={`star-btn ${task.is_starred ? 'active' : ''}`} onClick={() => handleToggleStar(task)}>
                          <Star size={18} fill={task.is_starred ? 'currentColor' : 'none'} />
                        </button>
                        <div className="signal-content">
                          <span className="kb-tag" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>{task.category}</span>
                          <h4 className={task.status === 'completed' ? 'strike' : ''}>{task.title}</h4>
                        </div>
                      </div>
                      <div className="signal-meta">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{task.status}</span>
                        <div className={`priority-dot ${task.priority}`} />
                        <div className="task-actions">
                          <button onClick={() => openEdit(task)}><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(task.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="kanban-board">
                  <KanbanColumn status="todo" label="Neural Queue" />
                  <KanbanColumn status="in_progress" label="Processing" />
                  <KanbanColumn status="completed" label="Synced Data" />
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingTask ? 'Re-align Signal' : 'Initialize Signal'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Signal ID (Title)</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Subsystem Zeta" />
              </div>
              <div className="form-group">
                <label>Node Category</label>
                <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Logical, Structural" />
              </div>
              <div className="form-group">
                <label>Context Array</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" />
              </div>
              <div className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Synapse Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Phase</label>
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
