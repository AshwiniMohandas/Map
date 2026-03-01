import { Eye, EyeOff, Ban, DollarSign, Save, X, ArrowLeft, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import { useStore } from '../store'
import './LayersPanel.css'
import { useState, useEffect } from 'react'

function LayersPanel() {
  const { layers, updateLayer, draftScenario, setDraftScenario, addLayerConfig, updateLayerConfig, setActivePanel, clearDraftScenario, currentScenario, scenarios, layerConfigs } = useStore()
  const [configName, setConfigName] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showSavePrompt, setShowSavePrompt] = useState(false)
  const [saveOption, setSaveOption] = useState('new') // 'update' or 'new'
  const [initialLayerState, setInitialLayerState] = useState(null)

  // Track the current scenario's layer config
  const currentScenarioData = scenarios.find(s => s.id === currentScenario)
  const currentLayerConfig = currentScenarioData ? layerConfigs.find(c => c.id === currentScenarioData.layerConfigId) : null

  // Initialize layer state tracking
  useEffect(() => {
    if (!draftScenario && currentLayerConfig) {
      // Save initial state for comparison
      const initialState = layers.reduce((acc, layer) => {
        acc[layer.id] = {
          visible: layer.visible,
          cost: layer.cost,
          forbidden: layer.forbidden
        }
        return acc
      }, {})
      setInitialLayerState(initialState)
    }
  }, [currentLayerConfig, draftScenario])

  // Check for unsaved changes
  useEffect(() => {
    if (!draftScenario && initialLayerState && currentLayerConfig) {
      const hasChanges = layers.some(layer => {
        const initial = initialLayerState[layer.id]
        return initial && (
          initial.visible !== layer.visible ||
          initial.cost !== layer.cost ||
          initial.forbidden !== layer.forbidden ||
          initial.considered !== layer.considered
        )
      })
      setHasUnsavedChanges(hasChanges)
    }
  }, [layers, initialLayerState, currentLayerConfig, draftScenario])

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      alert('Please enter a configuration name')
      return
    }

    // Create new layer config from current layer states
    const newConfig = {
      id: 'config-' + Date.now(),
      name: configName,
      description: 'Custom configuration',
      layers: layers.reduce((acc, layer) => {
        acc[layer.id] = {
          visible: layer.visible,
          cost: layer.cost,
          forbidden: layer.forbidden
        }
        return acc
      }, {})
    }

    addLayerConfig(newConfig)

    // Update draft scenario with new config ID
    if (draftScenario) {
      setDraftScenario({
        ...draftScenario,
        layerConfigId: newConfig.id
      })
    }

    // Clear config name and return to scenarios panel
    setConfigName('')
    setActivePanel('scenarios')
  }

  const handleUpdateExistingConfig = () => {
    if (!currentLayerConfig) return

    const updatedLayers = layers.reduce((acc, layer) => {
      acc[layer.id] = {
        visible: layer.visible,
        cost: layer.cost,
        forbidden: layer.forbidden,
        considered: layer.considered
      }
      return acc
    }, {})

    updateLayerConfig(currentLayerConfig.id, { layers: updatedLayers })
    setHasUnsavedChanges(false)
    setShowSavePrompt(false)

    // Update initial state to reflect saved changes
    setInitialLayerState(updatedLayers)
  }

  const handleSaveAsNewConfig = () => {
    if (!configName.trim()) {
      alert('Please enter a configuration name')
      return
    }

    const newConfig = {
      id: 'config-' + Date.now(),
      name: configName,
      description: `Based on ${currentLayerConfig?.name || 'current configuration'}`,
      layers: layers.reduce((acc, layer) => {
        acc[layer.id] = {
          visible: layer.visible,
          cost: layer.cost,
          forbidden: layer.forbidden
        }
        return acc
      }, {})
    }

    addLayerConfig(newConfig)
    setHasUnsavedChanges(false)
    setShowSavePrompt(false)
    setConfigName('')

    // Update initial state to reflect saved changes
    const updatedLayers = layers.reduce((acc, layer) => {
      acc[layer.id] = {
        visible: layer.visible,
        cost: layer.cost,
        forbidden: layer.forbidden,
        considered: layer.considered
      }
      return acc
    }, {})
    setInitialLayerState(updatedLayers)
  }

  const handleDiscardChanges = () => {
    // Restore initial layer state
    if (initialLayerState) {
      Object.keys(initialLayerState).forEach(layerId => {
        updateLayer(layerId, initialLayerState[layerId])
      })
    }
    setHasUnsavedChanges(false)
    setShowSavePrompt(false)
  }

  const handleCancelConfigCreation = () => {
    setConfigName('')
    clearDraftScenario()
    setActivePanel('scenarios')
  }

  return (
    <div className="panel-container">
      {draftScenario && (
        <div className="draft-banner">
          <div className="draft-banner-content">
            <div>
              <div className="draft-banner-title">Creating Layer Configuration</div>
              <div className="draft-banner-subtitle">
                Configuring layers for: <strong>{draftScenario.name}</strong>
              </div>
            </div>
            <button
              className="draft-banner-close"
              onClick={handleCancelConfigCreation}
              title="Cancel and return"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Banner */}
      {!draftScenario && hasUnsavedChanges && currentLayerConfig && (
        <div className="unsaved-banner">
          <div className="unsaved-banner-content">
            <AlertCircle size={18} />
            <div>
              <div className="unsaved-banner-title">Unsaved Changes</div>
              <div className="unsaved-banner-subtitle">
                You have modified the <strong>{currentLayerConfig.name}</strong> configuration
              </div>
            </div>
            <button
              className="btn-primary-small"
              onClick={() => setShowSavePrompt(true)}
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Save Changes Dialog */}
      {showSavePrompt && (
        <div className="save-prompt-overlay" onClick={() => setShowSavePrompt(false)}>
          <div className="save-prompt-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Layer Configuration Changes</h3>
            <p>You have unsaved changes to <strong>{currentLayerConfig?.name}</strong>. How would you like to save them?</p>

            <div className="save-options">
              <label className={`save-option ${saveOption === 'update' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="saveOption"
                  value="update"
                  checked={saveOption === 'update'}
                  onChange={(e) => setSaveOption(e.target.value)}
                />
                <div>
                  <div className="save-option-title">Update Existing Configuration</div>
                  <div className="save-option-description">Overwrite "{currentLayerConfig?.name}" with new settings</div>
                </div>
              </label>

              <label className={`save-option ${saveOption === 'new' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="saveOption"
                  value="new"
                  checked={saveOption === 'new'}
                  onChange={(e) => setSaveOption(e.target.value)}
                />
                <div>
                  <div className="save-option-title">Save as New Configuration</div>
                  <div className="save-option-description">Create a new configuration and keep the original unchanged</div>
                </div>
              </label>
            </div>

            {saveOption === 'new' && (
              <input
                type="text"
                placeholder="Enter new configuration name..."
                className="config-name-input"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
              />
            )}

            <div className="save-prompt-actions">
              <button className="btn-secondary" onClick={handleDiscardChanges}>
                Discard Changes
              </button>
              <button className="btn-secondary" onClick={() => setShowSavePrompt(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={saveOption === 'update' ? handleUpdateExistingConfig : handleSaveAsNewConfig}
              >
                <Save size={16} />
                {saveOption === 'update' ? 'Update Configuration' : 'Save as New'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="panel-header">
        <h2>Map Layers</h2>
        <p>Configure visibility, costs, and restrictions</p>
      </div>

      <div className="layers-list">
        {layers.map((layer) => (
          <div key={layer.id} className="layer-card">
            <div className="layer-header">
              <div className="layer-info">
                <div className="layer-color" style={{ background: layer.color }}></div>
                <div>
                  <div className="layer-name">{layer.name}</div>
                  <div className="layer-status">
                    {!layer.considered && (
                      <span className="status-badge not-considered">
                        <ToggleLeft size={12} />
                        Not Considered
                      </span>
                    )}
                    {layer.considered && layer.forbidden && (
                      <span className="status-badge forbidden">
                        <Ban size={12} />
                        Forbidden
                      </span>
                    )}
                    {layer.considered && !layer.forbidden && (
                      <span className="status-badge cost">
                        <DollarSign size={12} />
                        Cost: {layer.cost.toFixed(1)}x
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="layer-actions">
                <button
                  className={`icon-btn toggle-btn ${!layer.considered ? 'not-considered-btn' : 'considered-btn'}`}
                  onClick={() => updateLayer(layer.id, { considered: !layer.considered })}
                  title={layer.considered ? 'Exclude from routing' : 'Include in routing'}
                >
                  {layer.considered ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button
                  className="icon-btn"
                  onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                  title={layer.visible ? 'Hide layer' : 'Show layer'}
                >
                  {layer.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {layer.visible && (
              <div className="layer-controls">
                <div className="control-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={layer.forbidden}
                      onChange={(e) => updateLayer(layer.id, {
                        forbidden: e.target.checked,
                        cost: e.target.checked ? 10.0 : layer.cost
                      })}
                    />
                    <span>Mark as Forbidden Zone</span>
                  </label>
                </div>

                {!layer.forbidden && (
                  <div className="control-group">
                    <label className="slider-label">
                      Cost Multiplier: {layer.cost.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.1"
                      value={layer.cost}
                      onChange={(e) => updateLayer(layer.id, { cost: parseFloat(e.target.value) })}
                      className="slider"
                    />
                    <div className="slider-marks">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="panel-footer">
        {draftScenario ? (
          <div className="save-config-section">
            <input
              type="text"
              placeholder="Enter configuration name..."
              className="config-name-input"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
            />
            <div className="save-config-actions">
              <button
                className="btn-secondary"
                onClick={handleCancelConfigCreation}
              >
                <ArrowLeft size={16} />
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveConfiguration}
              >
                <Save size={16} />
                Save & Return
              </button>
            </div>
          </div>
        ) : (
          <button className="btn-secondary full-width">
            Reset All Layers
          </button>
        )}
      </div>
    </div>
  )
}

export default LayersPanel
