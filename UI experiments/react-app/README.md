# Grid Planning AI - Modern Agentic UI

A modern, dark-themed React application for AI-powered grid planning with transmission line routing capabilities.

## Features

- **Modern Agentic Design**: Sleek dark theme inspired by contemporary AI tools (Claude, ChatGPT, Cursor)
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **Interactive Map**: Canvas-based map for selecting route points
- **3-Step Setup Wizard**: Intuitive configuration flow
- **Route Management**: View, download, and manage past routes
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- React 18
- Vite (Fast build tool)
- Framer Motion (Animations)
- Lucide React (Modern icons)
- Pure CSS (No CSS frameworks)

## Getting Started

### Installation

```bash
cd "UI experiments/react-app"
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── MainMenu.jsx          # Landing page with options
│   ├── TransmissionSetup.jsx # 3-step setup wizard
│   ├── MapSelection.jsx      # Interactive map for route points
│   ├── Notification.jsx      # Submission confirmation
│   └── PastRoutes.jsx        # Route history management
├── App.jsx                   # Main app component
├── App.css                   # Global app styles
├── index.css                 # Base styles & CSS variables
└── main.jsx                  # Entry point
```

## Features Walkthrough

### 1. Main Menu
- Three primary options: Transmission Line Routing, Substation Siting, Add Your Case
- Quick stats display
- Modern card-based layout with gradient accents

### 2. Transmission Setup (3 Steps)
- **Step 1**: Choose algorithm (Default or Custom Heuristic)
- **Step 2**: Configure cost parameters (Distance, Terrain, Environmental, Land)
- **Step 3**: Select data layers (Elevation, Land Use, Protected Areas, etc.)

### 3. Interactive Map
- Click to set start point (green marker)
- Click again to set end point (red marker)
- Visual feedback with glow effects
- Grid background for spatial context

### 4. Notification
- Submission confirmation with unique ID
- Processing status indicator
- Navigation to view routes or return home

### 5. Past Routes
- Searchable route list
- Filter by status (Completed, Processing, Failed)
- Download routes as JSON
- Delete functionality

## Design Principles

- **Dark Theme**: Reduces eye strain, modern aesthetic
- **Consistent Spacing**: 8px grid system
- **Smooth Transitions**: 0.2-0.4s animations
- **Clear Hierarchy**: Typography scale from 12px to 48px
- **Accessible**: Focus states, proper contrast ratios
- **Performance**: Optimized animations, lazy loading ready

## Color Palette

```css
Primary Background:   #0a0a0a
Secondary Background: #111111
Tertiary Background:  #1a1a1a
Primary Accent:       #3b82f6 (Blue)
Secondary Accent:     #8b5cf6 (Purple)
Success:              #10b981 (Green)
Error:                #ef4444 (Red)
Warning:              #f59e0b (Orange)
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Future Enhancements

- Real-time route visualization on map
- 3D terrain rendering
- Advanced analytics dashboard
- Export to PDF/PNG
- Collaborative features
- AI chat assistant integration

## License

MIT
