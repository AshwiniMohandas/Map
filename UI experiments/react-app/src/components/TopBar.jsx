import { Layers, FolderKanban, Zap, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import './TopBar.css'

function TopBar() {
  const navigate = useNavigate()
  const { activePanel, setActivePanel, currentScenario, scenarios, projectName } = useStore()

  const scenario = scenarios.find(s => s.id === currentScenario)

  const handleBackToGridAI = () => {
    navigate('/')
  }

  return (
    <div className="topbar glass-panel">
      <div className="topbar-left">
        <div className="logo">
          <Zap className="logo-icon" />
          <span className="logo-text">Grid AI 3D</span>
        </div>

        {projectName && (
          <div className="project-badge">
            <span className="project-name">{projectName}</span>
          </div>
        )}

        <div className="scenario-badge">
          <span className="scenario-label">Active:</span>
          <span className="scenario-name">{scenario?.name || 'No Scenario'}</span>
        </div>
      </div>

      <div className="topbar-center">
        <button
          className={`tab-btn ${activePanel === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActivePanel('scenarios')}
        >
          <FolderKanban size={18} />
          <span>Scenarios</span>
        </button>

        <button
          className={`tab-btn ${activePanel === 'layers' ? 'active' : ''}`}
          onClick={() => setActivePanel('layers')}
        >
          <Layers size={18} />
          <span>Layers</span>
        </button>
      </div>

      <div className="topbar-right">
        <button className="btn-back-to-grid" onClick={handleBackToGridAI}>
          <ArrowLeft size={16} />
          Back to Grid AI
        </button>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Live</span>
        </div>
      </div>
    </div>
  )
}

export default TopBar
