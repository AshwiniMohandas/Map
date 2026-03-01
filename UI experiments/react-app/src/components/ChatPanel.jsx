import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import './ChatPanel.css'

function ChatPanel() {
  const { messages, addMessage } = useStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    addMessage({
      role: 'user',
      content: input
    })

    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I've analyzed the route. The current path shows 3 turns exceeding 30 degrees. Would you like me to optimize for smoother transitions?",
        "I've generated a new heuristic optimized for your terrain constraints. It reduces elevation changes by 35% compared to the default algorithm.",
        "Comparing scenarios: Base Case has a total cost of $4.2M while 'Avoid Protected Areas' costs $5.1M but reduces environmental impact by 60%.",
        "I've identified potential buffer zones. There are 2 areas where a 500m buffer would be beneficial for safety and environmental protection.",
      ]

      addMessage({
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      })

      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <Sparkles size={20} className="sparkle-icon" />
          <h3>AI Assistant</h3>
        </div>
        <div className="chat-status">
          <div className="status-indicator-dot"></div>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message assistant">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          placeholder="Ask me anything about your routes, scenarios, or data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatPanel
