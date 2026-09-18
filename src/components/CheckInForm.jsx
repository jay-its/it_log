import { useEffect, useRef, useState } from 'react'

const REASONS = [
  'Chromebook / Hardware',
  'Password Reset',
  'Wi-Fi / Network',
  'Software Help',
  'Other',
]

export default function CheckInForm({ onSubmit, submitting, resetSignal }) {
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [reason, setReason] = useState('')
  const idInputRef = useRef(null)

  useEffect(() => {
    setStudentId('')
    setStudentName('')
    setReason('')
    idInputRef.current?.focus()
  }, [resetSignal])

  const isValid = studentId.trim().length > 0 && studentName.trim().length > 0 && reason

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid || submitting) return
    onSubmit({
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      reason,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 px-5 py-6">
      <div>
        <label htmlFor="checkin-id" className="mb-2 block text-sm font-semibold text-gray-500">
          Student ID
        </label>
        <div className="relative">
          <input
            id="checkin-id"
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
      </div>

      <div>
        <label htmlFor="checkin-name" className="mb-2 block text-sm font-semibold text-gray-500">
          Student Name
        </label>
        <input
          id="checkin-name"
          type="text"
          autoComplete="off"
          placeholder="Jane Doe"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full rounded-2xl border-2 border-gray-300 bg-white px-5 py-5 text-2xl font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold text-gray-500">Reason for Visit</span>
        <div className="flex flex-wrap gap-3">
          {REASONS.map((option) => {
            const selected = reason === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => setReason(option)}
                className={`rounded-full border-2 px-5 py-4 text-lg font-semibold transition-colors ${
                  selected
                    ? 'border-blue-900 bg-blue-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 active:bg-gray-100'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="w-full rounded-2xl bg-emerald-600 py-6 text-2xl font-bold text-white shadow-lg transition-opacity active:bg-emerald-700 disabled:opacity-30"
        >
          {submitting ? 'Signing In…' : 'Sign In'}
        </button>
      </div>
    </form>
  )
}
