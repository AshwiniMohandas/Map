import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Play, Check, Layers as LayersIcon, Zap, Upload, Route, ChevronDown, ChevronRight } from 'lucide-react'
import { useStore } from '../store'
import './ScenariosPanel.css'

function ScenariosPanel() {
  const { scenarios, currentScenario, setCurrentScenario, addScenario, deleteScenario, updateScenario, layerConfigs, setActivePanel, heuristics, addMessage, draftScenario, setDraftScenario } = useStore()
  const [isCreating, setIsCreating] = useState(false)
  const [expandedScenarios, setExpandedScenarios] = useState({})
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    layerConfigId: 'config-1',
    heuristicId: 'default',
    routeSource: 'generated', // 'generated' | 'manual'
    routeFile: null
  })

  const toggleExpanded = (scenarioId) => {
    setExpandedScenarios(prev => ({
      ...prev,
      [scenarioId]: !prev[scenarioId]
    }))
  }

  // Restore draft scenario when returning from Layers panel
  useEffect(() => {
    if (draftScenario) {
      setNewScenario(draftScenario)
      setIsCreating(true)
    }
  }, [draftScenario])

  const handleCreate = () => {
    if (!newScenario.name) return

    const scenario = {
      id: 'scenario-' + Date.now(),
      name: newScenario.name,
      description: newScenario.description,
      layerConfigId: newScenario.layerConfigId,
      heuristicId: newScenario.routeSource === 'manual' ? 'n/a' : newScenario.heuristicId,
      routeSource: newScenario.routeSource,
      routeFile: newScenario.routeFile,
      startPoint: { x: -5, y: 0, z: 5 },
      endPoint: { x: 5, y: 0, z: -5 },
      route: null,
      created: new Date().toISOString(),
    }

    addScenario(scenario)
    setNewScenario({
      name: '',
      description: '',
      layerConfigId: 'config-1',
      heuristicId: 'default',
      routeSource: 'generated',
      routeFile: null
    })
    setIsCreating(false)

    // Clear draft scenario if exists
    if (draftScenario) {
      setDraftScenario(null)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewScenario({ ...newScenario, routeFile: file.name })
    }
  }

  const getHeuristic = (heuristicId) => {
    return heuristics.find(h => h.id === heuristicId) || heuristics[0]
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getLayerConfig = (configId) => {
    return layerConfigs.find(c => c.id === configId) || layerConfigs[0]
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Scenarios</h2>
        <p>Manage and compare different routing scenarios</p>
      </div>

      <button
        className="btn-primary full-width"
        onClick={() => setIsCreating(true)}
      >
        <Plus size={18} />
        Create New Scenario
      </button>

      {isCreating && (
        <div className="create-scenario-form">
          <input
            type="text"
            placeholder="Scenario name..."
            className="input"
            value={newScenario.name}
            onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)..."
            className="textarea"
            value={newScenario.description}
            onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
          />

          <div className="scenario-config-section">
            <h3>1. Layer Configuration</h3>
            <div className="form-group">
              <label className="form-label">
                {newScenario.routeSource === 'manual'
                  ? 'Choose layer visualization (for overlay only, costs not applicable)'
                  : 'Choose layer cost and visibility settings'}
              </label>
              <select
                className="select-input"
                value={newScenario.layerConfigId}
                onChange={(e) => setNewScenario({ ...newScenario, layerConfigId: e.target.value })}
              >
                {layerConfigs.map(config => (
                  <option key={config.id} value={config.id}>
                    {config.name} - {config.description}
                  </option>
                ))}
              </select>
              {newScenario.routeSource !== 'manual' && (
                <button
                  type="button"
                  className="create-new-btn"
                  onClick={() => {
                    // Save current state as draft
                    setDraftScenario(newScenario)
                    // Navigate to layers panel
                    setActivePanel('layers')
                  }}
                >
                  <Plus size={14} />
                  Create new layer configuration
                </button>
              )}
            </div>
          </div>

          <div className="scenario-config-section">
            <h3>2. Heuristic Choice</h3>
            <div className="form-group">
              <label className="form-label">Select pathfinding algorithm</label>
              <select
                className="select-input"
                value={newScenario.heuristicId}
                onChange={(e) => setNewScenario({ ...newScenario, heuristicId: e.target.value })}
                disabled={newScenario.routeSource === 'manual'}
              >
                {newScenario.routeSource === 'manual' ? (
                  <option value="n/a">N/A (Manual Route)</option>
                ) : (
                  heuristics.map(heuristic => (
                    <option key={heuristic.id} value={heuristic.id}>
                      {heuristic.name} - {heuristic.description}
                    </option>
                  ))
                )}
              </select>
              {newScenario.routeSource === 'manual' && (
                <div className="info-message">
                  Heuristic does not apply to manually uploaded routes
                </div>
              )}
              {newScenario.routeSource !== 'manual' && (
                <button
                  type="button"
                  className="create-new-btn"
                  onClick={() => {
                    setActivePanel('chat')
                    setIsCreating(false)
                    addMessage({
                      role: 'user',
                      content: 'Generate a new heuristic optimized for my scenario'
                    })
                  }}
                >
                  <Plus size={14} />
                  Generate new heuristic
                </button>
              )}
            </div>
          </div>

          <div className="scenario-config-section">
            <h3>3. Route Source</h3>
            <div className="form-group">
              <label className="form-label">How will the route be created?</label>
              <div className="route-source-options">
                <button
                  type="button"
                  className={`route-option ${newScenario.routeSource === 'generated' ? 'active' : ''}`}
                  onClick={() => setNewScenario({ ...newScenario, routeSource: 'generated', routeFile: null })}
                >
                  <Zap size={18} />
                  <span>Generate Route</span>
                  <p>Use selected heuristic to generate optimal route</p>
                </button>
                <button
                  type="button"
                  className={`route-option ${newScenario.routeSource === 'manual' ? 'active' : ''}`}
                  onClick={() => setNewScenario({ ...newScenario, routeSource: 'manual' })}
                >
                  <Upload size={18} />
                  <span>Upload Route</span>
                  <p>Manually upload a pre-defined route file</p>
                </button>
              </div>

              {newScenario.routeSource === 'manual' && (
                <div className="file-upload-section">
                  <label className="file-upload-btn">
                    <input
                      type="file"
                      accept=".json,.geojson,.csv"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <Upload size={16} />
                    {newScenario.routeFile ? newScenario.routeFile : 'Choose file...'}
                  </label>
                  <p className="file-help-text">Accepts: JSON, GeoJSON, CSV formats</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-secondary" onClick={() => setIsCreating(false)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleCreate}>
              Create Scenario
            </button>
          </div>
        </div>
      )}

      <div className="scenarios-list">
        {scenarios.map((scenario) => {
          const layerConfig = getLayerConfig(scenario.layerConfigId)
          const heuristic = getHeuristic(scenario.heuristicId)

          return (
            <div
              key={scenario.id}
              className={`scenario-card ${currentScenario === scenario.id ? 'active' : ''}`}
              onClick={() => setCurrentScenario(scenario.id)}
            >
              <div className="scenario-header">
                <div>
                  <div className="scenario-name">{scenario.name}</div>
                  <div className="scenario-meta">{formatDate(scenario.created)}</div>
                </div>
                {currentScenario === scenario.id && (
                  <div className="active-badge">
                    <Check size={14} />
                    Active
                  </div>
                )}
              </div>

              {scenario.description && (
                <div className="scenario-description">{scenario.description}</div>
              )}

              {/* Scenario Definition Section */}
              <div className="scenario-definition">
                <button
                  className="definition-toggle"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpanded(scenario.id)
                  }}
                >
                  <div className="definition-toggle-content">
                    {expandedScenarios[scenario.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="definition-label">Scenario Definition</span>
                  </div>
                </button>

                {expandedScenarios[scenario.id] && (
                  <div className="definition-expanded">
                    {/* 1. Layer Configuration */}
                    <div className="definition-item">
                      <LayersIcon size={14} />
                      <div className="definition-content">
                        <span className="definition-title">Layer Config:</span>
                        <span className="definition-value">{layerConfig.name}</span>
                      </div>
                      <button
                        className="view-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActivePanel('layers')
                        }}
                        title="View layer configuration"
                      >
                        View
                      </button>
                    </div>

                    {/* 2. Heuristic */}
                    <div className="definition-item">
                      <Zap size={14} />
                      <div className="definition-content">
                        <span className="definition-title">Heuristic:</span>
                        <span className="definition-value">
                          {scenario.heuristicId === 'n/a' ? 'N/A' : (heuristic?.name || 'Default')}
                        </span>
                      </div>
                    </div>

                    {/* 3. Route Source */}
                    <div className="definition-item">
                      {scenario.routeSource === 'uploaded' ? <Upload size={14} /> : <Route size={14} />}
                      <div className="definition-content">
                        <span className="definition-title">Route:</span>
                        <span className="definition-value">
                          {scenario.route
                            ? (scenario.routeSource === 'uploaded'
                                ? `Uploaded${scenario.routeFile ? ` (${scenario.routeFile})` : ''}`
                                : 'Generated')
                            : 'Not generated'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="scenario-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert('Run simulation')
                  }}
                  title="Run simulation"
                >
                  <Play size={14} />
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert('Duplicate scenario')
                  }}
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                {scenarios.length > 1 && (
                  <button
                    className="action-btn danger"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this scenario?')) {
                        deleteScenario(scenario.id)
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScenariosPanel
