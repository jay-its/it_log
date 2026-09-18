export default function SuccessOverlay({ mode, name, queued, queuedReason }) {
  const isCheckIn = mode === 'checkin'
  const queuedMessage =
    queuedReason === 'no-url'
      ? 'Backend not connected yet — saved on this device and will sync once configured.'
      : 'No connection right now — saved on this device and will sync automatically.'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-center ${
        isCheckIn ? 'bg-emerald-600' : 'bg-sky-600'
      }`}
      role="alert"
    >
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/20">
        <svg
          className="h-20 w-20 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-8 text-4xl font-extrabold text-white">
        {isCheckIn ? "You're checked in!" : 'See you later!'}
      </h2>
      {name && <p className="mt-3 text-2xl font-medium text-white/90">{name}</p>}
      {queued && (
        <p className="mt-6 max-w-sm text-base font-medium text-white/80">{queuedMessage}</p>
      )}
    </div>
  )
}
