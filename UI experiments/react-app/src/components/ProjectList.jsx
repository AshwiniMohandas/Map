import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Eye, Trash2, Search, Calendar, Layers } from 'lucide-react'
import './ProjectList.css'

const ProjectList = ({ onNewProject, onViewProject, onBack }) => {
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('transmissionProjects')
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId)
      setProjects(updatedProjects)
      localStorage.setItem('transmissionProjects', JSON.stringify(updatedProjects))
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      <button className="btn-ghost back-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <div className="project-list-container">
        <div className="project-list-header">
          <div>
            <h1>Transmission Line Projects</h1>
            <p>Create a new project or continue with an existing one</p>
          </div>
          <button className="btn-primary" onClick={onNewProject}>
            <Plus size={18} />
            New Project
          </button>
        </div>

        {projects.length > 0 && (
          <div className="search-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="input search-input"
              placeholder="Search projects by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="projects-grid">
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <Search size={48} />
                  <h3>No projects found</h3>
                  <p>Try adjusting your search</p>
                </>
              ) : (
                <>
                  <Layers size={48} />
                  <h3>No projects yet</h3>
                  <p>Create your first transmission line routing project</p>
                  <button className="btn-primary" onClick={onNewProject}>
                    <Plus size={18} />
                    Create Project
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="project-card-header">
                  <h3>{project.name}</h3>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>

                <div className="project-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{formatDate(project.created)}</span>
                  </div>
                  <div className="meta-item">
                    <Layers size={14} />
                    <span>{project.scenarios?.length || 0} scenario{project.scenarios?.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="project-details">
                  <div className="detail-row">
                    <span className="detail-label">Start Point:</span>
                    <span className="detail-value">
                      ({project.startPoint?.x.toFixed(1)}, {project.startPoint?.y.toFixed(1)})
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">End Point:</span>
                    <span className="detail-value">
                      ({project.endPoint?.x.toFixed(1)}, {project.endPoint?.y.toFixed(1)})
                    </span>
                  </div>
                </div>

                <div className="project-actions">
                  <button
                    className="btn-primary"
                    onClick={() => onViewProject(project)}
                  >
                    <Eye size={16} />
                    View Project
                  </button>
                  <button
                    className="action-btn-icon danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProject(project.id)
                    }}
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectList
