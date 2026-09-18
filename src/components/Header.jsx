export default function Header({ activeTab, onChangeTab }) {
  return (
    <header className="bg-blue-900 px-4 pt-4 pb-3">
      <h1 className="text-center text-2xl font-bold text-white tracking-tight">
        IT Helpdesk Sign-In
      </h1>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-blue-950/60 p-1">
        <button
          type="button"
          onClick={() => onChangeTab('checkin')}
          className={`rounded-xl py-4 text-lg font-semibold transition-colors ${
            activeTab === 'checkin'
              ? 'bg-white text-blue-900 shadow'
              : 'text-blue-200 active:bg-blue-800/50'
          }`}
        >
          Check In
        </button>
        <button
          type="button"
          onClick={() => onChangeTab('checkout')}
          className={`rounded-xl py-4 text-lg font-semibold transition-colors ${
            activeTab === 'checkout'
              ? 'bg-white text-blue-900 shadow'
              : 'text-blue-200 active:bg-blue-800/50'
          }`}
        >
          Check Out
        </button>
      </div>
    </header>
  )
}
