import { motion } from 'framer-motion'
import { ArrowLeft, Workflow, MapPin, Plus, ChevronRight } from 'lucide-react'
import './PastProjects.css'

const PastProjects = ({ onSelectTransmission, onBack }) => {
  const projectTypes = [
    {
      id: 'transmission',
      icon: Workflow,
      title: 'Transmission Line Routing',
      description: 'View all your transmission line routing projects',
      count: 12,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      action: onSelectTransmission
    },
    {
      id: 'substation',
      icon: MapPin,
      title: 'Substation Siting',
      description: 'Access substation siting project history',
      count: 0,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => alert('No substation projects yet')
    },
    {
      id: 'custom',
      icon: Plus,
      title: 'Custom Cases',
      description: 'Review your custom planning scenarios',
      count: 0,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => alert('No custom projects yet')
    }
  ]

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

      <div className="past-projects">
        <div className="projects-header">
          <h1>Past Projects</h1>
          <p>Browse your project history by category</p>
        </div>

        <div className="project-types-grid">
          {projectTypes.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-type-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={project.action}
            >
              <div className="project-type-header">
                <div className="project-icon" style={{ background: project.gradient }}>
                  <project.icon size={28} />
                </div>
                <div className="project-badge">
                  {project.count} {project.count === 1 ? 'Project' : 'Projects'}
                </div>
              </div>

              <div className="project-type-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>

              <div className="project-type-footer">
                <span className="view-link">
                  View All
                  <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon transmission">
                <Workflow size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">New transmission route completed</div>
                <div className="activity-meta">RT-SAMPLE1 • 1 day ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon transmission">
                <Workflow size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Route analysis in progress</div>
                <div className="activity-meta">RT-SAMPLE2 • 2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PastProjects
