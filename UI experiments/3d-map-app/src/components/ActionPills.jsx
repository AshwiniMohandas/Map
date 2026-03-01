import { Wand2, GitCompare, MessageSquare } from 'lucide-react'
import { useStore } from '../store'
import './ActionPills.css'

function ActionPills() {
  const { addMessage, setActivePanel } = useStore()

  const showComingSoon = () => {
    // Open a new window with coming soon message
    const comingSoonWindow = window.open('', '_blank', 'width=600,height=400')
    comingSoonWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Coming Soon</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .container {
              text-align: center;
              color: white;
              padding: 2rem;
            }
            h1 {
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1.25rem;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Coming Soon</h1>
            <p>This feature is currently under development.</p>
          </div>
        </body>
      </html>
    `)
    comingSoonWindow.document.close()
  }

  const actions = [
    {
      id: 'compare-scenarios',
      icon: GitCompare,
      label: 'Compare Scenarios',
      color: '#10b981',
      action: showComingSoon
    },
    {
      id: 'ai-assistant',
      icon: MessageSquare,
      label: 'AI Assistant',
      color: '#3b82f6',
      action: () => {
        setActivePanel('chat')
        addMessage({
          role: 'user',
          content: 'Show me the number of turns over 30 degrees in this route'
        })
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: "**Route Analysis:**\n\n• Total turns: 8\n• Turns >30°: 3 (37.5%)\n• Sharpest turn: 45° at waypoint 5\n• Avg turn angle: 24°\n\nI can optimize the route to reduce sharp turns if needed. Would you also like me to generate a 500m buffer zone around the route?"
          })
        }, 1500)
      }
    },
    {
      id: 'generate-heuristic',
      icon: Wand2,
      label: 'Generate Heuristic',
      color: '#8b5cf6',
      action: showComingSoon
    }
  ]

  return (
    <div className="action-pills">
      {actions.map((action) => (
        <button
          key={action.id}
          className="pill"
          onClick={action.action}
          style={{ '--pill-color': action.color }}
        >
          <action.icon size={16} />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ActionPills
