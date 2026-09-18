import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import CheckInForm from './components/CheckInForm'
import CheckOutForm from './components/CheckOutForm'
import SuccessOverlay from './components/SuccessOverlay'
import UrlSetupModal from './components/UrlSetupModal'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { getScriptUrl, setScriptUrl, hasScriptUrl, getQueueLength, submitAction, syncQueue } from './lib/api'

const URL_PROMPT_DISMISSED_KEY = 'it_log_url_prompt_dismissed'

export default function App() {
  const [activeTab, setActiveTab] = useState('checkin')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null) // { mode, name, queued }
  const [resetSignal, setResetSignal] = useState(0)
  const [queueLength, setQueueLength] = useState(getQueueLength())
  const [showUrlModal, setShowUrlModal] = useState(
    !hasScriptUrl() && localStorage.getItem(URL_PROMPT_DISMISSED_KEY) !== 'true',
  )
  const isOnline = useOnlineStatus()
  const successTimerRef = useRef(null)

  const refreshQueueLength = useCallback(() => setQueueLength(getQueueLength()), [])

  const runSync = useCallback(async () => {
    if (!isOnline || !hasScriptUrl()) return
    await syncQueue()
    refreshQueueLength()
  }, [isOnline, refreshQueueLength])

  // Sync any queued entries whenever we come online or on initial load.
  useEffect(() => {
    if (isOnline) runSync()
  }, [isOnline, runSync])

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current)
  }, [])

  function scheduleReset() {
    clearTimeout(successTimerRef.current)
    successTimerRef.current = setTimeout(() => {
      setSuccess(null)
      setResetSignal((n) => n + 1)
    }, 3000)
  }

  async function handleCheckIn({ studentId, studentName, reason }) {
    setSubmitting(true)
    const payload = {
      action: 'checkIn',
      studentId,
      studentName,
      reason,
      timestamp: new Date().toISOString(),
    }
    const result = await submitAction(payload)
    refreshQueueLength()
    setSubmitting(false)
    setSuccess({ mode: 'checkin', name: studentName, queued: result.queued, queuedReason: result.reason })
    scheduleReset()
  }

  async function handleCheckOut({ studentId }) {
    setSubmitting(true)
    const payload = {
      action: 'checkOut',
      studentId,
      timestamp: new Date().toISOString(),
    }
    const result = await submitAction(payload)
    refreshQueueLength()
    setSubmitting(false)
    setSuccess({ mode: 'checkout', name: null, queued: result.queued, queuedReason: result.reason })
    scheduleReset()
  }

  function handleSaveUrl(url) {
    setScriptUrl(url)
    localStorage.removeItem(URL_PROMPT_DISMISSED_KEY)
    setShowUrlModal(false)
    runSync()
  }

  function handleCloseUrlModal() {
    localStorage.setItem(URL_PROMPT_DISMISSED_KEY, 'true')
    setShowUrlModal(false)
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-gray-50 safe-top safe-bottom">
      <StatusBar
        isOnline={isOnline}
        queueLength={queueLength}
        onConfigure={() => setShowUrlModal(true)}
      />
      <Header activeTab={activeTab} onChangeTab={setActiveTab} />

      <main className="flex flex-1 flex-col">
        {activeTab === 'checkin' ? (
          <CheckInForm onSubmit={handleCheckIn} submitting={submitting} resetSignal={resetSignal} />
        ) : (
          <CheckOutForm onSubmit={handleCheckOut} submitting={submitting} resetSignal={resetSignal} />
        )}
      </main>

      {success && (
        <SuccessOverlay
          mode={success.mode}
          name={success.name}
          queued={success.queued}
          queuedReason={success.queuedReason}
        />
      )}

      {showUrlModal && (
        <UrlSetupModal
          initialUrl={getScriptUrl()}
          onSave={handleSaveUrl}
          onClose={handleCloseUrlModal}
          canClose={hasScriptUrl()}
        />
      )}
    </div>
  )
}
