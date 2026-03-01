import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import Map3D from './components/Map3D'
import LayersPanel from './components/LayersPanel'
import ScenariosPanel from './components/ScenariosPanel'
import ChatPanel from './components/ChatPanel'
import TopBar from './components/TopBar'
import ActionPills from './components/ActionPills'
import RouteInfo from './components/RouteInfo'
import { useStore } from './store'
import './App.css'

function App() {
  const { activePanel, showRouteInfo } = useStore()

  return (
    <div className="app-container">
      <TopBar />

      {/* 3D Map Canvas */}
      <div className="canvas-container">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.2}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Grid */}
          <Grid
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#2a2a2a"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#3a3a3a"
            fadeDistance={50}
            fadeStrength={1}
            infiniteGrid
          />

          {/* 3D Map */}
          <Map3D />
        </Canvas>

        {/* Route Info Overlay */}
        {showRouteInfo && <RouteInfo />}
      </div>

      {/* Left Panel */}
      <div className="left-panel glass-panel">
        {activePanel === 'layers' && <LayersPanel />}
        {activePanel === 'scenarios' && <ScenariosPanel />}
      </div>

      {/* Right Panel - Chat */}
      {activePanel === 'chat' && (
        <div className="right-panel glass-panel">
          <ChatPanel />
        </div>
      )}

      {/* Action Pills */}
      <ActionPills />
    </div>
  )
}

export default App
