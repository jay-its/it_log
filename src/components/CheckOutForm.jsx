import { useEffect, useRef, useState } from 'react'
import { useElapsedSeconds } from '../hooks/useElapsedSeconds'

export default function CheckOutForm({ onSubmit, submitting, resetSignal }) {
  const [studentId, setStudentId] = useState('')
  const idInputRef = useRef(null)
  const elapsed = useElapsedSeconds(submitting)

  useEffect(() => {
    setStudentId('')
    idInputRef.current?.focus()
  }, [resetSignal])

  const isValid = studentId.trim().length > 0

  let submitLabel = 'Sign Out'
  if (submitting) {
    if (elapsed >= 8) submitLabel = 'Still working… first sign-out of the day can take a minute'
    else if (elapsed >= 3) submitLabel = 'Still working…'
    else submitLabel = 'Signing Out…'
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid || submitting) return
    // iOS Safari doesn't blur a focused text input when a <button> is tapped,
    // so the keyboard would otherwise stay open behind the success screen.
    document.activeElement?.blur()
    onSubmit({ studentId: studentId.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 px-5 py-6">
      <div>
        <label htmlFor="checkout-id" className="mb-2 block text-sm font-semibold text-gray-500">
          Student ID
        </label>
        <div className="relative">
          <input
            id="checkout-id"
            ref={idInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="123456"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full rounded-2xl border-2 border-gray-300 bg-white px-5 py-5 text-3xl font-semibold tracking-wide text-gray-900 focus:border-blue-600 focus:outline-none"
          />
          {studentId && (
            <button
              type="button"
              onClick={() => {
                setStudentId('')
                idInputRef.current?.focus()
              }}
              aria-label="Clear student ID"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-600 active:bg-gray-300"
            >
              ×
            </button>
          )}
        </div>
        <p className="mt-3 text-base text-gray-500">
          Enter your Student ID to sign out of your most recent visit.
        </p>
      </div>

      <div className="mt-auto pt-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className={`w-full rounded-2xl bg-sky-600 py-6 font-bold text-white shadow-lg transition-opacity active:bg-sky-700 disabled:opacity-60 ${
            submitting && elapsed >= 8 ? 'text-lg' : 'text-2xl'
          }`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
