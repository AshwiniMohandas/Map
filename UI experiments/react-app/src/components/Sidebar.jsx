import { motion } from 'framer-motion'
import { Home, FolderOpen, Zap, Settings } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ currentView, onViewProjects, onBackToMenu }) => {
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <div className="logo">
          <Zap className="logo-icon" />
          <span className="logo-text">Grid AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentView === 'menu' ? 'active' : ''}`}
          onClick={onBackToMenu}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${currentView === 'projects' || currentView === 'routes' ? 'active' : ''}`}
          onClick={onViewProjects}
        >
          <FolderOpen size={20} />
          <span>Past Projects</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </motion.aside>
  )
}

export default Sidebar
