import { create } from 'zustand'

// Load project data from localStorage if available
const loadProjectData = () => {
  const currentProject = localStorage.getItem('currentProject')
  if (currentProject) {
    const project = JSON.parse(currentProject)
    return {
      startPoint: project.startPoint,
      endPoint: project.endPoint,
      scenarios: project.scenarios || [],
      projectName: project.name
    }
  }
  return {
    startPoint: { x: -5, y: 0, z: 5 },
    endPoint: { x: 5, y: 0, z: -5 },
    scenarios: [],
    projectName: null
  }
}

const projectData = loadProjectData()

export const useStore = create((set) => ({
  // Map layers
  layers: [
    { id: 'elevation', name: 'Elevation', visible: true, cost: 1.0, forbidden: false, considered: true, color: '#8b7355' },
    { id: 'landuse', name: 'Land Use', visible: true, cost: 1.2, forbidden: false, considered: true, color: '#6b9c4d' },
    { id: 'rooftop', name: 'Rooftop Data', visible: true, cost: 2.0, forbidden: false, considered: true, color: '#e11d48' },
    { id: 'protected', name: 'Protected Areas', visible: false, cost: 5.0, forbidden: true, considered: true, color: '#ef4444' },
    { id: 'infrastructure', name: 'Infrastructure', visible: true, cost: 0.8, forbidden: false, considered: true, color: '#6b7280' },
    { id: 'waterBodies', name: 'Water Bodies', visible: true, cost: 3.0, forbidden: false, considered: true, color: '#3b82f6' },
    { id: 'roads', name: 'Roads', visible: true, cost: 0.5, forbidden: false, considered: true, color: '#f59e0b' },
  ],

  updateLayer: (id, updates) => set((state) => ({
    layers: state.layers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    )
  })),

  // Scenarios
  currentScenario: projectData.scenarios[0]?.id || 'scenario-1',
  scenarios: projectData.scenarios.length > 0 ? projectData.scenarios : [
    {
      id: 'scenario-1',
      name: 'Base Case',
      description: 'Standard routing with all data layers',
      layerConfigId: 'config-1',
      heuristicId: 'default',
      routeSource: 'generated',
      routeFile: null,
      startPoint: projectData.startPoint,
      endPoint: projectData.endPoint,
      route: null,
      created: new Date().toISOString(),
    },
    {
      id: 'scenario-2',
      name: 'Without Rooftop Data',
      description: 'Route without considering rooftop data',
      layerConfigId: 'config-2',
      heuristicId: 'default',
      routeSource: 'generated',
      routeFile: null,
      startPoint: projectData.startPoint,
      endPoint: projectData.endPoint,
      route: null,
      created: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'scenario-3',
      name: 'Manual Route',
      description: 'Manually uploaded route',
      layerConfigId: 'config-1',
      heuristicId: 'default',
      routeSource: 'uploaded',
      routeFile: 'manual_route.geojson',
      startPoint: projectData.startPoint,
      endPoint: projectData.endPoint,
      route: null,
      created: new Date(Date.now() - 172800000).toISOString(),
    },
  ],

  // Project metadata
  projectName: projectData.projectName,

  // Layer Configurations (presets that scenarios can use)
  layerConfigs: [
    {
      id: 'config-1',
      name: 'Standard Config',
      description: 'Balanced layer costs with all data',
      layers: {
        elevation: { visible: true, cost: 1.0, forbidden: false, considered: true },
        landuse: { visible: true, cost: 1.2, forbidden: false, considered: true },
        rooftop: { visible: true, cost: 2.0, forbidden: false, considered: true },
        protected: { visible: false, cost: 5.0, forbidden: true, considered: true },
        infrastructure: { visible: true, cost: 0.8, forbidden: false, considered: true },
        waterBodies: { visible: true, cost: 3.0, forbidden: false, considered: true },
        roads: { visible: true, cost: 0.5, forbidden: false, considered: true },
      }
    },
    {
      id: 'config-2',
      name: 'Without Rooftop Data',
      description: 'Excludes rooftop data from routing',
      layers: {
        elevation: { visible: true, cost: 1.0, forbidden: false, considered: true },
        landuse: { visible: true, cost: 1.5, forbidden: false, considered: true },
        rooftop: { visible: true, cost: 2.0, forbidden: false, considered: false },
        protected: { visible: true, cost: 10.0, forbidden: true, considered: true },
        infrastructure: { visible: true, cost: 0.8, forbidden: false, considered: true },
        waterBodies: { visible: true, cost: 4.0, forbidden: false, considered: true },
        roads: { visible: true, cost: 0.5, forbidden: false, considered: true },
      }
    },
    {
      id: 'config-3',
      name: 'Cost Optimized',
      description: 'Minimize construction costs',
      layers: {
        elevation: { visible: true, cost: 0.8, forbidden: false, considered: true },
        landuse: { visible: true, cost: 0.9, forbidden: false, considered: true },
        rooftop: { visible: true, cost: 1.5, forbidden: false, considered: true },
        protected: { visible: true, cost: 5.0, forbidden: true, considered: true },
        infrastructure: { visible: true, cost: 0.5, forbidden: false, considered: true },
        waterBodies: { visible: true, cost: 2.5, forbidden: false, considered: true },
        roads: { visible: true, cost: 0.3, forbidden: false, considered: true },
      }
    },
  ],

  addLayerConfig: (config) => set((state) => ({
    layerConfigs: [...state.layerConfigs, config]
  })),

  updateLayerConfig: (id, updates) => set((state) => ({
    layerConfigs: state.layerConfigs.map(config =>
      config.id === id ? { ...config, ...updates } : config
    )
  })),

  // Draft scenario (for creating scenarios with custom layer configs)
  draftScenario: null,
  setDraftScenario: (draft) => set({ draftScenario: draft }),
  clearDraftScenario: () => set({ draftScenario: null }),


  setCurrentScenario: (id) => set({ currentScenario: id }),

  addScenario: (scenario) => set((state) => ({
    scenarios: [...state.scenarios, scenario],
    currentScenario: scenario.id,
  })),

  updateScenario: (id, updates) => set((state) => ({
    scenarios: state.scenarios.map(s =>
      s.id === id ? { ...s, ...updates } : s
    )
  })),

  deleteScenario: (id) => set((state) => ({
    scenarios: state.scenarios.filter(s => s.id !== id),
    currentScenario: state.currentScenario === id ? state.scenarios[0]?.id : state.currentScenario,
  })),

  // Chat messages
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI planning assistant. I can help you generate heuristics, analyze routes, compare scenarios, and perform exploratory data analysis. How can I assist you today?',
      timestamp: new Date().toISOString(),
    }
  ],

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() }]
  })),

  // UI State
  activePanel: 'scenarios', // 'layers', 'scenarios', 'chat'
  setActivePanel: (panel) => set({ activePanel: panel }),

  showRouteInfo: false,
  setShowRouteInfo: (show) => set({ showRouteInfo: show }),

  // Route data
  currentRoute: null,
  setCurrentRoute: (route) => set({ currentRoute: route }),

  // Heuristics
  heuristics: [
    {
      id: 'default',
      name: 'A* Default',
      description: 'Standard A* pathfinding algorithm',
      active: true,
    },
    {
      id: 'terrain-aware',
      name: 'Terrain-Aware',
      description: 'Optimizes for minimal elevation changes',
      active: false,
    },
  ],

  activeHeuristic: 'default',
  setActiveHeuristic: (id) => set({ activeHeuristic: id }),

  addHeuristic: (heuristic) => set((state) => ({
    heuristics: [...state.heuristics, heuristic]
  })),
}))
