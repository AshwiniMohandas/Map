import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, RotateCcw, Send } from 'lucide-react'
import './MapSelection.css'

const MapSelection = ({ onSubmit, onBack }) => {
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    drawMap()
  }, [startPoint, endPoint])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw line between points
    if (startPoint && endPoint) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(startPoint.x, startPoint.y)
      ctx.lineTo(endPoint.x, endPoint.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw start point
    if (startPoint) {
      const gradient = ctx.createRadialGradient(startPoint.x, startPoint.y, 0, startPoint.x, startPoint.y, 20)
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)')
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(startPoint.x - 20, startPoint.y - 20, 40, 40)

      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(startPoint.x, startPoint.y, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw end point
    if (endPoint) {
      const gradient = ctx.createRadialGradient(endPoint.x, endPoint.y, 0, endPoint.x, endPoint.y, 20)
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(endPoint.x - 20, endPoint.y - 20, 40, 40)

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(endPoint.x, endPoint.y, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (!startPoint) {
      setStartPoint({ x, y })
    } else if (!endPoint) {
      setEndPoint({ x, y })
    }
  }

  const handleReset = () => {
    setStartPoint(null)
    setEndPoint(null)
  }

  const handleSubmit = () => {
    if (startPoint && endPoint) {
      onSubmit(startPoint, endPoint)
    }
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
        Back to Setup
      </button>

      <div className="map-selection">
        <div className="map-header">
          <h1>Select Route Points</h1>
          <p>Click on the map to set your start point, then click again to set your end point</p>
        </div>

        <div className="map-wrapper">
          <div className="map-info">
            <div className={`point-indicator ${startPoint ? 'active' : ''}`}>
              <div className="indicator-dot start" />
              <div>
                <div className="indicator-label">Start Point</div>
                <div className="indicator-value">
                  {startPoint ? `${Math.round(startPoint.x)}, ${Math.round(startPoint.y)}` : 'Not set'}
                </div>
              </div>
            </div>

            <div className={`point-indicator ${endPoint ? 'active' : ''}`}>
              <div className="indicator-dot end" />
              <div>
                <div className="indicator-label">End Point</div>
                <div className="indicator-value">
                  {endPoint ? `${Math.round(endPoint.x)}, ${Math.round(endPoint.y)}` : 'Not set'}
                </div>
              </div>
            </div>
          </div>

          <div className="map-container">
            <canvas
              ref={canvasRef}
              className="map-canvas"
              onClick={handleCanvasClick}
            />
            {!startPoint && (
              <div className="map-hint">
                <MapPin size={24} />
                <span>Click anywhere to set your start point</span>
              </div>
            )}
            {startPoint && !endPoint && (
              <div className="map-hint">
                <MapPin size={24} />
                <span>Now click to set your end point</span>
              </div>
            )}
          </div>
        </div>

        <div className="map-actions">
          <button className="btn-secondary" onClick={handleReset}>
            <RotateCcw size={18} />
            Reset Points
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!startPoint || !endPoint}
          >
            Submit for Analysis
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MapSelection
