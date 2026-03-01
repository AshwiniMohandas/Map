import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import * as THREE from 'three'

function Map3D() {
  const { layers, currentScenario, scenarios } = useStore()
  const terrainRef = useRef()

  const scenario = scenarios.find(s => s.id === currentScenario)

  // Animate terrain
  useFrame((state) => {
    if (terrainRef.current) {
      terrainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  // Generate terrain height based on position
  const getTerrainHeight = (x, z) => {
    return Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2
  }

  return (
    <group ref={terrainRef}>
      {/* Terrain base */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Elevation layer */}
      {layers.find(l => l.id === 'elevation')?.visible && (
        <mesh receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[20, 20, 32, 32]} />
          <meshStandardMaterial
            color="#2d3748"
            wireframe={false}
            side={THREE.DoubleSide}
onBeforeCompile={(shader) => {
              shader.vertexShader = `
                varying vec3 vPosition;
                ${shader.vertexShader}
              `.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>
                float elevation = sin(position.x * 0.5) * cos(position.z * 0.5) * 2.0;
                transformed.y += elevation;
                vPosition = transformed;
                `
              )
              shader.fragmentShader = `
                varying vec3 vPosition;
                ${shader.fragmentShader}
              `.replace(
                '#include <color_fragment>',
                `
                #include <color_fragment>
                float height = vPosition.y;
                vec3 lowColor = vec3(0.17, 0.22, 0.28);
                vec3 highColor = vec3(0.54, 0.45, 0.33);
                diffuseColor.rgb = mix(lowColor, highColor, (height + 2.0) / 4.0);
                `
              )
            }}
          />
        </mesh>
      )}

      {/* Protected areas (red zones) */}
      {layers.find(l => l.id === 'protected')?.visible && (
        <>
          <mesh position={[-3, 0.1, 2]} receiveShadow>
            <cylinderGeometry args={[2, 2, 0.2, 32]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.6}
              emissive="#ef4444"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh position={[4, 0.1, -3]} receiveShadow>
            <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
            <meshStandardMaterial
              color="#ef4444"
              transparent
              opacity={0.6}
              emissive="#ef4444"
              emissiveIntensity={0.2}
            />
          </mesh>
        </>
      )}

      {/* Water bodies */}
      {layers.find(l => l.id === 'waterBodies')?.visible && (
        <>
          <mesh position={[0, 0.05, -4]} receiveShadow>
            <planeGeometry args={[4, 3]} />
            <meshStandardMaterial
              color="#3b82f6"
              transparent
              opacity={0.7}
              emissive="#3b82f6"
              emissiveIntensity={0.3}
            />
          </mesh>
        </>
      )}

      {/* Infrastructure */}
      {layers.find(l => l.id === 'infrastructure')?.visible && (
        <>
          {/* Power lines */}
          <group position={[-6, 1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 3, 0.2]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
          </group>

          <group position={[6, 1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 3, 0.2]} />
              <meshStandardMaterial color="#6b7280" />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </>
      )}

      {/* Start and End Points */}
      {scenario && (
        <>
          {/* Start Point */}
          <group position={[scenario.startPoint.x, scenario.startPoint.y + 1, scenario.startPoint.z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight color="#10b981" intensity={2} distance={5} />
          </group>

          {/* End Point */}
          <group position={[scenario.endPoint.x, scenario.endPoint.y + 1, scenario.endPoint.z]}>
            <mesh castShadow>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#ef4444"
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight color="#ef4444" intensity={2} distance={5} />
          </group>

          {/* Route Line */}
          {scenario.route && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={scenario.route.length}
                  array={new Float32Array(scenario.route.flat())}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#3b82f6" linewidth={3} />
            </line>
          )}
        </>
      )}
    </group>
  )
}

export default Map3D
