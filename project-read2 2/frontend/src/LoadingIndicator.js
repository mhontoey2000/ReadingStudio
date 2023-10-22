import React from 'react'
import "./styles/loading.css";
function LoadingIndicator() {
  return (
    <div className="loading-container">
      <div className="loading"></div>
      {/* You can add a loading animation or spinner here */}
    </div>
  )
}

export default LoadingIndicator