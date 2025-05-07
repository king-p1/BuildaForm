"use client"

export function StatusIndicator({ status }: { status: string }) {
  const isCompleted = status === "COMPLETED"
  
  return (
    <div className="flex items-center gap-2 text-muted-foreground p-3">
      <div 
        className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`} 
      />
      <span className="text-xs font-semibold text-gray-500">{status}</span>
    </div>
  )
}