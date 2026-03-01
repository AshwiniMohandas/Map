import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Download, Trash2, Eye } from 'lucide-react'
import './PastRoutes.css'

const PastRoutes = ({ routes, onDeleteRoute, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus
    return matchesSearch && matchesStatus
  })

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'badge-success'
      case 'processing': return 'badge-warning'
      case 'failed': return 'badge-error'
      default: return 'badge-info'
    }
  }

  const handleDownload = (route) => {
    const dataStr = JSON.stringify(route, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${route.id}.json`
    link.click()
    URL.revokeObjectURL(url)
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
        Back to Past Projects
      </button>

      <div className="routes-container">
        <div className="routes-header">
          <div>
            <h1>Transmission Line Routes</h1>
            <p>View and manage your generated routes</p>
          </div>
          <div className="routes-stats">
            <div className="stat-badge">
              <span className="stat-number">{routes.length}</span>
              <span className="stat-text">Total Routes</span>
            </div>
            <div className="stat-badge">
              <span className="stat-number">{routes.filter(r => r.status === 'completed').length}</span>
              <span className="stat-text">Completed</span>
            </div>
          </div>
        </div>

        <div className="routes-filters">
          <div className="search-wrapper">
            <Search size={18} />
            <input
              type="text"
              className="input search-input"
              placeholder="Search routes by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="routes-list">
          {filteredRoutes.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <h3>No routes found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                className="route-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <div className="route-card-header">
                  <div className="route-id">{route.id}</div>
                  <span className={`badge ${getStatusBadgeClass(route.status)}`}>
                    {route.status}
                  </span>
                </div>

                <div className="route-meta">
                  <div className="meta-item">
                    <span className="meta-label">Algorithm</span>
                    <span className="meta-value">
                      {route.algorithm === 'default' ? 'Default A*' : 'Custom Heuristic'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Created</span>
                    <span className="meta-value">{formatDate(route.timestamp)}</span>
                  </div>
                </div>

                <div className="route-actions">
                  {route.status === 'completed' && (
                    <>
                      <button
                        className="action-btn"
                        onClick={() => alert('View details coming soon!')}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDownload(route)}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    </>
                  )}
                  <button
                    className="action-btn danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this route?')) {
                        onDeleteRoute(route.id)
                      }
                    }}
                    title="Delete"
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

export default PastRoutes
