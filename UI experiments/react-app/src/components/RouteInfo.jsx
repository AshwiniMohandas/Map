import { X, MapPin, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { useStore } from '../store'
import './RouteInfo.css'

function RouteInfo() {
  const { setShowRouteInfo } = useStore()

  return (
    <div className="route-info-overlay">
      <div className="route-info-card glass-panel">
        <div className="route-info-header">
          <h3>Route Analysis</h3>
          <button
            className="close-btn"
            onClick={() => setShowRouteInfo(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="route-stats">
          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <MapPin size={20} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="stat-label">Distance</div>
              <div className="stat-value">14.2 km</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <DollarSign size={20} style={{ color: '#10b981' }} />
            </div>
            <div>
              <div className="stat-label">Est. Cost</div>
              <div className="stat-value">$4.2M</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Clock size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <div className="stat-label">Build Time</div>
              <div className="stat-value">5 days</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <TrendingUp size={20} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <div className="stat-label">Elevation Δ</div>
              <div className="stat-value">128 m</div>
            </div>
          </div>
        </div>

        <div className="route-details">
          <div className="detail-row">
            <span className="detail-label">Waypoints</span>
            <span className="detail-value">12</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Turns (>30°)</span>
            <span className="detail-value">3</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Protected zones crossed</span>
            <span className="detail-value">0</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Terrain difficulty</span>
            <span className="detail-value badge-medium">Medium</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteInfo
