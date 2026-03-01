import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, History } from 'lucide-react'
import './Notification.css'

const Notification = ({ submissionId, onViewRoutes, onBackToMenu }) => {
  return (
    <motion.div
      className="page-container centered"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="notification-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={64} />
        </motion.div>

        <h1>Route Analysis Submitted</h1>
        <p className="notification-message">
          Your transmission line routing request has been successfully submitted.
          You will be notified once the results are available.
        </p>

        <div className="submission-info">
          <div className="info-label">Submission ID</div>
          <div className="info-value">{submissionId}</div>
        </div>

        <div className="processing-status">
          <div className="status-bar">
            <motion.div
              className="status-progress"
              initial={{ width: 0 }}
              animate={{ width: '30%' }}
              transition={{ delay: 0.6, duration: 1 }}
            />
          </div>
          <div className="status-text">
            <span className="status-dot" />
            Processing your request...
          </div>
        </div>

        <div className="notification-actions">
          <button className="btn-secondary" onClick={onBackToMenu}>
            <ArrowRight size={18} />
            Back to Home
          </button>
          <button className="btn-primary" onClick={onViewRoutes}>
            <History size={18} />
            View Past Routes
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Notification
