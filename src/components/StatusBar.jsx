export default function StatusBar({ isOnline, queueLength, onConfigure }) {
  return (
    <div className="flex items-center justify-between px-4 py-1.5 text-xs font-medium bg-blue-950 text-blue-200">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}
          aria-hidden="true"
        />
        <span>{isOnline ? 'Online' : 'Offline — saving locally'}</span>
        {queueLength > 0 && (
          <span className="ml-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-300">
            {queueLength} pending sync
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onConfigure}
        className="opacity-60 hover:opacity-100 active:opacity-100"
        aria-label="Kiosk settings"
      >
        ⚙︎
      </button>
    </div>
  )
}
