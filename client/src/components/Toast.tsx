import { CheckCircle2 } from 'lucide-react'

type ToastProps = {
  message: string
}

function Toast({
  message
}: ToastProps) {
  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 size={18} />

      <span>{message}</span>
    </div>
  )
}

export default Toast