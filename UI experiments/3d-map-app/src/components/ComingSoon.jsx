import { ArrowLeft } from 'lucide-react'
import './ComingSoon.css'

function ComingSoon() {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <h1>Coming Soon</h1>
        <p>This feature is currently under development.</p>
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  )
}

export default ComingSoon
