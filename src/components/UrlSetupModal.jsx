import { useState } from 'react'

export default function UrlSetupModal({ initialUrl, onSave, onClose, canClose }) {
  const [value, setValue] = useState(initialUrl || '')
  const isValid = /^https:\/\/script\.google\.com\/.+/.test(value.trim())

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">Connect to Backend</h2>
        <p className="mt-2 text-sm text-gray-600">
          Paste the deployed Google Apps Script Web App URL. This is only needed once per
          device — it's saved locally on this iPad.
        </p>
        <input
          type="url"
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-4 w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:border-blue-600 focus:outline-none"
        />
        <div className="mt-5 flex gap-3">
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 py-3 text-base font-semibold text-gray-700 active:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSave(value.trim())}
            className="flex-1 rounded-xl bg-blue-900 py-3 text-base font-semibold text-white disabled:opacity-40 active:bg-blue-800"
          >
            Save
          </button>
        </div>
        {!canClose && (
          <p className="mt-4 text-xs text-gray-400">
            You can still use the kiosk offline — entries will be saved on this device and
            synced once a backend URL is configured.
          </p>
        )}
        {!canClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full text-center text-xs font-medium text-gray-400 underline"
          >
            Continue without connecting for now
          </button>
        )}
      </div>
    </div>
  )
}
