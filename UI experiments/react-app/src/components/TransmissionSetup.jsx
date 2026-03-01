import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import './TransmissionSetup.css'

const TransmissionSetup = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1)
  const [algorithm, setAlgorithm] = useState('default')
  const [customHeuristic, setCustomHeuristic] = useState({ name: '', description: '' })
  const [costParameters, setCostParameters] = useState([
    { id: 'distance', label: 'Distance ($/km)', value: 1000, checked: true },
    { id: 'terrain', label: 'Terrain Difficulty', value: 500, checked: false },
    { id: 'environmental', label: 'Environmental Impact', value: 750, checked: false },
    { id: 'land', label: 'Land Acquisition', value: 1500, checked: false }
  ])
  const [dataLayers, setDataLayers] = useState([
    { id: 'elevation', label: 'Elevation Data', checked: true },
    { id: 'landuse', label: 'Land Use', checked: true },
    { id: 'protected', label: 'Protected Areas', checked: false },
    { id: 'infrastructure', label: 'Existing Infrastructure', checked: false },
    { id: 'population', label: 'Population Density', checked: false },
    { id: 'vegetation', label: 'Vegetation Cover', checked: false }
  ])

  const steps = [
    { number: 1, label: 'Algorithm' },
    { number: 2, label: 'Cost Parameters' },
    { number: 3, label: 'Data Layers' }
  ]

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    onComplete({
      algorithm,
      customHeuristic: algorithm === 'custom' ? customHeuristic : null,
      costParameters: costParameters.filter(p => p.checked),
      dataLayers: dataLayers.filter(l => l.checked)
    })
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

      <div className="setup-container">
        <div className="setup-header">
          <h1>Transmission Line Routing Setup</h1>
          <p>Configure your routing parameters in 3 simple steps</p>
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
              <h2>Choose Algorithm</h2>
              <p className="step-description">Select the routing algorithm that best fits your needs</p>

              <div className="algorithm-options">
                <label className={`radio-card ${algorithm === 'default' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="algorithm"
                    value="default"
                    checked={algorithm === 'default'}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  />
                  <div className="radio-card-content">
                    <div className="radio-circle" />
                    <div>
                      <h4>Default Algorithm</h4>
                      <p>Use the standard A* pathfinding algorithm optimized for transmission line routing</p>
                    </div>
                  </div>
                </label>

                <label className={`radio-card ${algorithm === 'custom' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="algorithm"
                    value="custom"
                    checked={algorithm === 'custom'}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  />
                  <div className="radio-card-content">
                    <div className="radio-circle" />
                    <div>
                      <h4>Create New Heuristic</h4>
                      <p>Define your own custom routing heuristic with specific parameters</p>
                    </div>
                  </div>
                </label>
              </div>

              {algorithm === 'custom' && (
                <motion.div
                  className="custom-heuristic"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="form-group">
                    <label>Heuristic Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Mountain-Optimized Routing"
                      value={customHeuristic.name}
                      onChange={(e) => setCustomHeuristic({ ...customHeuristic, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="textarea"
                      placeholder="Describe your heuristic approach..."
                      value={customHeuristic.description}
                      onChange={(e) => setCustomHeuristic({ ...customHeuristic, description: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="step-panel">
              <h2>Choose Cost Parameters</h2>
              <p className="step-description">Select and configure the cost factors for route optimization</p>

              <div className="parameters-grid">
                {costParameters.map((param) => (
                  <div key={param.id} className="parameter-card">
                    <label className="parameter-checkbox">
                      <input
                        type="checkbox"
                        checked={param.checked}
                        onChange={(e) => setCostParameters(costParameters.map(p =>
                          p.id === param.id ? { ...p, checked: e.target.checked } : p
                        ))}
                      />
                      <div className="checkbox-custom" />
                      <span>{param.label}</span>
                    </label>
                    <input
                      type="number"
                      className="input"
                      value={param.value}
                      onChange={(e) => setCostParameters(costParameters.map(p =>
                        p.id === param.id ? { ...p, value: parseFloat(e.target.value) } : p
                      ))}
                      disabled={!param.checked}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-panel">
              <h2>Choose Data Layers</h2>
              <p className="step-description">Select the data layers to include in your analysis</p>

              <div className="layers-grid">
                {dataLayers.map((layer) => (
                  <label key={layer.id} className={`layer-card ${layer.checked ? 'selected' : ''}`}>
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
              Proceed to Map
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TransmissionSetup
