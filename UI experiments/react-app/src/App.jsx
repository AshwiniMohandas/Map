import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import MainMenu from './components/MainMenu'
import ProjectList from './components/ProjectList'
import ProjectSetup from './components/ProjectSetup'
import TransmissionSetup from './components/TransmissionSetup'
import MapSelection from './components/MapSelection'
import Notification from './components/Notification'
import PastProjects from './components/PastProjects'
import PastRoutes from './components/PastRoutes'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('menu')
  const [currentProject, setCurrentProject] = useState(null)
  const [setupData, setSetupData] = useState({
    algorithm: 'default',
    costParameters: [],
    dataLayers: []
  })
  const [routes, setRoutes] = useState([
    {
      id: 'RT-SAMPLE1',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      algorithm: 'default',
      status: 'completed'
    },
    {
      id: 'RT-SAMPLE2',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      algorithm: 'custom',
      status: 'processing'
    }
  ])
  const [submissionId, setSubmissionId] = useState('')

  const handleStartTransmission = () => {
    setCurrentView('projectList')
  }

  const handleNewProject = () => {
    setCurrentView('projectSetup')
  }

  const handleProjectSetupComplete = (projectData) => {
    // Save project to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('transmissionProjects') || '[]')
    savedProjects.push(projectData)
    localStorage.setItem('transmissionProjects', JSON.stringify(savedProjects))

    setCurrentProject(projectData)
    setCurrentView('scenarioSetup')
  }

  const handleViewProject = (project) => {
    setCurrentProject(project)
    // Store project data in localStorage for 3d-map-app to access
    localStorage.setItem('currentProject', JSON.stringify(project))
    // Navigate to 3d-map-app
    window.open('http://localhost:5174/', '_blank')
  }

  const handleSetupComplete = (data) => {
    setSetupData(data)

    // Save scenario to current project
    const scenario = {
      id: 'scenario-' + Date.now(),
      name: 'Scenario ' + ((currentProject.scenarios?.length || 0) + 1),
      description: `Using ${data.algorithm} algorithm`,
      layerConfigId: 'config-1', // Default config
      heuristicId: data.algorithm,
      routeSource: 'generated',
      routeFile: null,
      startPoint: currentProject.startPoint,
      endPoint: currentProject.endPoint,
      route: null,
      created: new Date().toISOString(),
      algorithm: data.algorithm,
      customHeuristic: data.customHeuristic,
      costParameters: data.costParameters,
      dataLayers: data.dataLayers
    }

    // Update project with new scenario
    const updatedProject = {
      ...currentProject,
      scenarios: [...(currentProject.scenarios || []), scenario]
    }

    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('transmissionProjects') || '[]')
    const projectIndex = savedProjects.findIndex(p => p.id === currentProject.id)
    if (projectIndex !== -1) {
      savedProjects[projectIndex] = updatedProject
      localStorage.setItem('transmissionProjects', JSON.stringify(savedProjects))
    }

    setCurrentProject(updatedProject)

    // Navigate to 3d-map-app
    localStorage.setItem('currentProject', JSON.stringify(updatedProject))
    window.open('http://localhost:5174/', '_blank')

    // Return to project list
    setCurrentView('projectList')
  }

  const handleRouteSubmit = (startPoint, endPoint) => {
    const newId = 'RT-' + Date.now().toString(36).toUpperCase()
    setSubmissionId(newId)

    const newRoute = {
      id: newId,
      timestamp: new Date().toISOString(),
      algorithm: setupData.algorithm,
      startPoint,
      endPoint,
      costParameters: setupData.costParameters,
      dataLayers: setupData.dataLayers,
      status: 'processing'
    }

    setRoutes([newRoute, ...routes])
    setCurrentView('notification')

    // Simulate completion
    setTimeout(() => {
      setRoutes(prev => prev.map(r =>
        r.id === newId ? { ...r, status: 'completed' } : r
      ))
    }, 5000)
  }

  const handleViewProjects = () => {
    setCurrentView('projects')
  }

  const handleViewRoutes = () => {
    setCurrentView('routes')
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  const handleBackToProjects = () => {
    setCurrentView('projects')
  }

  return (
    <div className="app">
      <Sidebar
        currentView={currentView}
        onViewProjects={handleViewProjects}
        onBackToMenu={handleBackToMenu}
      />

      <main className="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'menu' && (
            <MainMenu
              key="menu"
              onStartTransmission={handleStartTransmission}
            />
          )}

          {currentView === 'projectList' && (
            <ProjectList
              key="projectList"
              onNewProject={handleNewProject}
              onViewProject={handleViewProject}
              onBack={handleBackToMenu}
            />
          )}

          {currentView === 'projectSetup' && (
            <ProjectSetup
              key="projectSetup"
              onComplete={handleProjectSetupComplete}
              onBack={() => setCurrentView('projectList')}
            />
          )}

          {currentView === 'scenarioSetup' && (
            <TransmissionSetup
              key="scenarioSetup"
              onComplete={handleSetupComplete}
              onBack={() => setCurrentView('projectList')}
            />
          )}

          {currentView === 'transmission' && (
            <TransmissionSetup
              key="transmission"
              onComplete={handleSetupComplete}
              onBack={handleBackToMenu}
            />
          )}

          {currentView === 'map' && (
            <MapSelection
              key="map"
              onSubmit={handleRouteSubmit}
              onBack={() => setCurrentView('transmission')}
            />
          )}

          {currentView === 'notification' && (
            <Notification
              key="notification"
              submissionId={submissionId}
              onViewRoutes={handleViewRoutes}
              onBackToMenu={handleBackToMenu}
            />
          )}

          {currentView === 'projects' && (
            <PastProjects
              key="projects"
              onSelectTransmission={handleViewRoutes}
              onBack={handleBackToMenu}
            />
          )}

          {currentView === 'routes' && (
            <PastRoutes
              key="routes"
              routes={routes}
              onDeleteRoute={(id) => setRoutes(routes.filter(r => r.id !== id))}
              onBack={handleBackToProjects}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
