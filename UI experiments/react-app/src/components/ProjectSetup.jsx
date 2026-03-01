import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, MapPin } from 'lucide-react'
import './ProjectSetup.css'

const ProjectSetup = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [startPoint, setStartPoint] = useState({ x: -5, y: 0, z: 5 })
  const [endPoint, setEndPoint] = useState({ x: 5, y: 0, z: -5 })
  const [dataLayers, setDataLayers] = useState([
    { id: 'elevation', label: 'Elevation', checked: true },
    { id: 'landuse', label: 'Land Use', checked: true },
    { id: 'protected', label: 'Protected Areas', checked: false },
    { id: 'infrastructure', label: 'Infrastructure', checked: false },
    { id: 'waterBodies', label: 'Water Bodies', checked: true },
    { id: 'roads', label: 'Roads', checked: true }
  ])

  const steps = [
    { number: 1, label: 'Project Info' },
    { number: 2, label: 'Map Points' },
    { number: 3, label: 'Data Layers' }
  ]

  const handleNext = () => {
    if (step === 1 && !projectName.trim()) {
      alert('Please enter a project name')
      return
    }
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    const projectData = {
      id: 'proj-' + Date.now(),
      name: projectName,
      description: projectDescription,
      startPoint,
      endPoint,
      dataLayers: dataLayers.filter(l => l.checked),
      created: new Date().toISOString(),
      scenarios: []
    }
    onComplete(projectData)
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
        Back
      </button>

      <div className="setup-container">
        <div className="setup-header">
          <h1>Create New Project</h1>
          <p>Configure your transmission line routing project</p>
        </div>

        <div className="progress-bar">
          {steps.map((s, index) => (
            <div key={s.number} className="progress-step-wrapper">
              <div className={`progress-step ${step >= s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.number ? <Check size={16} /> : s.number}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {index < steps.length - 1 && <div className={`progress-line ${step > s.number ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          className="step-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="step-panel">
              <h2>Project Information</h2>
              <p className="step-description">Enter basic details about your project</p>

              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Mountain Pass Transmission Line"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  className="textarea"
                  placeholder="Add any additional details about this project..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-panel">
              <h2>Define Route Endpoints</h2>
              <p className="step-description">Set the start and end points for your transmission line</p>

              <div className="points-grid">
                <div className="point-section start">
                  <div className="point-header">
                    <MapPin size={18} />
                    <h3>Start Point</h3>
                  </div>
                  <div className="coordinate-inputs">
                    <div className="coordinate-input">
                      <label>X</label>
                      <input
                        type="number"
                        className="input"
                        value={startPoint.x}
                        onChange={(e) => setStartPoint({ ...startPoint, x: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                    <div className="coordinate-input">
                      <label>Y</label>
                      <input
                        type="number"
                        className="input"
                        value={startPoint.y}
                        onChange={(e) => setStartPoint({ ...startPoint, y: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                    <div className="coordinate-input">
                      <label>Z</label>
                      <input
                        type="number"
                        className="input"
                        value={startPoint.z}
                        onChange={(e) => setStartPoint({ ...startPoint, z: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>

                <div className="point-section end">
                  <div className="point-header">
                    <MapPin size={18} />
                    <h3>End Point</h3>
                  </div>
                  <div className="coordinate-inputs">
                    <div className="coordinate-input">
                      <label>X</label>
                      <input
                        type="number"
                        className="input"
                        value={endPoint.x}
                        onChange={(e) => setEndPoint({ ...endPoint, x: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                    <div className="coordinate-input">
                      <label>Y</label>
                      <input
                        type="number"
                        className="input"
                        value={endPoint.y}
                        onChange={(e) => setEndPoint({ ...endPoint, y: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                    <div className="coordinate-input">
                      <label>Z</label>
                      <input
                        type="number"
                        className="input"
                        value={endPoint.z}
                        onChange={(e) => setEndPoint({ ...endPoint, z: parseFloat(e.target.value) || 0 })}
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-box">
                <p>💡 You can adjust these points later in the 3D visualization</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-panel">
              <h2>Select Data Layers</h2>
              <p className="step-description">Choose which map layers to include in your analysis</p>

              <div className="layers-grid">
                {dataLayers.map((layer) => (
                  <label key={layer.id} className={`layer-checkbox-card ${layer.checked ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={layer.checked}
                      onChange={(e) => setDataLayers(dataLayers.map(l =>
                        l.id === layer.id ? { ...l, checked: e.target.checked } : l
                      ))}
                    />
                    <div className="checkbox-custom" />
                    <span>{layer.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="step-actions">
          {step > 1 && (
            <button className="btn-secondary" onClick={handlePrev}>
              <ArrowLeft size={18} />
              Previous
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext}>
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleComplete}>
              Create Project
              <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectSetup
