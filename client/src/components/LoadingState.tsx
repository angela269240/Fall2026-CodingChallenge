type LoadingStateProps = {
  message?: string
}

function LoadingState({
  message = 'Loading...'
}: LoadingStateProps) {
  return (
    <div
      className="loading-state"
      role="status"
    >
      <div className="spinner" />

      <p>{message}</p>
    </div>
  )
}

export default LoadingState