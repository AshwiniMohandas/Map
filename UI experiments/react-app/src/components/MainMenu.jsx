import { motion } from 'framer-motion'
import { Workflow, MapPin, Plus, Sparkles } from 'lucide-react'
import './MainMenu.css'

const MainMenu = ({ onStartTransmission }) => {
  const options = [
    {
      id: 'transmission',
      icon: Workflow,
      title: 'Transmission Line Routing',
      description: 'AI-powered optimal route planning for transmission lines',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      action: onStartTransmission
    },
    {
      id: 'substation',
      icon: MapPin,
      title: 'Substation Siting',
      description: 'Identify optimal locations for substations using advanced algorithms',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => alert('Coming soon!')
    },
    {
      id: 'custom',
      icon: Plus,
      title: 'Add Your Case',
      description: 'Create a custom planning scenario with your parameters',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => alert('Coming soon!')
    }
  ]

  return (
    <motion.div
      className="page-container centered"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="main-menu">
        <motion.div
          className="menu-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="sparkle-icon">
            <Sparkles />
          </div>
          <h1>What would you like to plan today?</h1>
          <p>Choose an option below to get started with AI-powered grid planning</p>
        </motion.div>

        <div className="options-grid">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              className="option-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={option.action}
            >
              <div className="option-icon" style={{ background: option.gradient }}>
                <option.icon size={24} />
              </div>
              <div className="option-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </div>
              <div className="option-arrow">→</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="quick-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div className="stat-item">
            <div className="stat-value">2.4K+</div>
            <div className="stat-label">Routes Planned</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">98.5%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-value">45min</div>
            <div className="stat-label">Avg. Processing</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MainMenu
