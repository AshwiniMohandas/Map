# Grid Planning 3D - AI Powered

A modern, agentic UI for 3D grid planning with AI-powered route optimization, featuring interactive 3D maps, layer management, scenario comparison, and intelligent chat assistance.

## 🎯 Features

### 🗺️ Core: 3D Interactive Map
- **Three.js** powered 3D terrain visualization
- Real-time elevation rendering with custom shaders
- Interactive camera controls (OrbitControls)
- Dynamic lighting and shadows
- Layer-based visualization system

### 🎨 1. Layer Management Panel
- **Visual Layer Control**: Toggle visibility for 6+ map layers
- **Cost Definition**: Adjust cost multipliers (0.1x - 5.0x) for each layer
- **Forbidden Zones**: Mark areas as restricted
- **Real-time Updates**: Changes reflected instantly on 3D map

Available Layers:
- Elevation (terrain height)
- Land Use
- Protected Areas
- Infrastructure
- Water Bodies
- Roads

### 📁 2. Scenario Selection & Creation
- **Multiple Scenarios**: Create and manage different routing scenarios
- **Quick Compare**: Switch between scenarios instantly
- **Custom Parameters**: Each scenario has unique start/end points
- **History Tracking**: Timestamped scenario creation

### 💬 3. AI Chat Assistant
- **Natural Language Queries**: Ask questions in plain English
- **Contextual Responses**: AI understands your current scenario
- **Action Pills**: Quick access to common operations
- **Real-time Chat**: Instant responses with typing indicators

### 🎯 4. Action Pills (Quick Actions)

#### 3.1 Generate Heuristic
- Auto-generates optimized routing algorithms
- Terrain-aware, cost-optimized, or environmental focus
- 25-35% improvement over default

#### 3.2 View Heuristics
- List all available algorithms
- Compare characteristics
- See performance metrics

#### 3.3 Compare Scenarios
- Side-by-side comparison
- Cost, distance, time analysis
- Environmental impact assessment

#### 3.4 EDA Queries
- **Turn Analysis**: "Show me turns over 30 degrees"
- **Buffer Zones**: "Generate a 500m buffer"
- **Elevation Stats**: Analyze height changes
- **Cost Breakdown**: Detailed route economics

Example queries:
```
"Show me the number of 30 degree turns in this route"
"Generate a buffer zone around the route"
"What's the total elevation change?"
"Compare costs between scenarios"
"Identify steepest sections"
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helpers and abstractions
- **Zustand** - State management
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## 🚀 Getting Started

### Installation

```bash
cd "UI experiments/3d-map-app"
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

## 🎮 Usage

### Navigation
1. **Camera**: Click and drag to rotate, scroll to zoom
2. **Panels**: Switch between Layers, Scenarios, and AI Assistant tabs
3. **Quick Actions**: Use action pills at the bottom for instant operations

### Layer Management
1. Click "Layers" tab
2. Toggle eye icon to show/hide layers
3. Adjust cost sliders for routing optimization
4. Check "Forbidden Zone" to mark restricted areas

### Scenario Workflow
1. Click "Scenarios" tab
2. Create new scenario with custom name
3. Click scenario card to activate
4. View route visualization on 3D map

### AI Assistant
1. Click "AI Assistant" tab
2. Type natural language queries OR
3. Click action pills for quick operations:
   - **Wand icon**: Generate new heuristic
   - **Eye icon**: View all heuristics
   - **Compare icon**: Compare scenarios
   - **Chart icon**: Run EDA queries

## 📊 Data Flow

```
User Input → Store (Zustand) → 3D Map + UI Panels
                ↓
          AI Assistant → Analysis → Recommendations
```

## 🎨 Design System

### Colors
- **Primary**: #3b82f6 (Blue) - Actions, active states
- **Secondary**: #8b5cf6 (Purple) - Accents
- **Success**: #10b981 (Green) - Confirmations
- **Warning**: #f59e0b (Orange) - Alerts
- **Error**: #ef4444 (Red) - Forbidden zones

### Typography
- **Headings**: 18-36px, Bold
- **Body**: 13-14px, Regular
- **Labels**: 11-12px, Uppercase

### Spacing
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

## 🔮 Future Enhancements

- [ ] Real pathfinding algorithms (A*, Dijkstra)
- [ ] Export routes to GeoJSON/KML
- [ ] Multi-user collaboration
- [ ] Time-based simulation (construction phases)
- [ ] Weather/seasonal impact analysis
- [ ] Cost optimization suggestions
- [ ] Integration with GIS data
- [ ] Mobile AR view

## 📁 Project Structure

```
src/
├── components/
│   ├── Map3D.jsx          # 3D terrain & visualization
│   ├── TopBar.jsx         # Navigation tabs
│   ├── LayersPanel.jsx    # Layer management
│   ├── ScenariosPanel.jsx # Scenario CRUD
│   ├── ChatPanel.jsx      # AI assistant chat
│   ├── ActionPills.jsx    # Quick action buttons
│   └── RouteInfo.jsx      # Route analytics overlay
├── store.js               # Zustand state management
├── App.jsx                # Main app component
└── index.css              # Global styles
```

## 🤝 Contributing

This is an experimental UI project. Feel free to fork and enhance!

## 📝 License

MIT

---

**Built with Claude Code** 🤖
Modern Agentic UI for Grid Planning
