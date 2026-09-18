const STORAGE_KEY_URL = 'it_log_apps_script_url'
const STORAGE_KEY_QUEUE = 'it_log_pending_queue'

/** Resolve the Apps Script Web App URL: env var first, then localStorage. */
export function getScriptUrl() {
  const envUrl = import.meta.env.VITE_APPS_SCRIPT_URL
  if (envUrl) return envUrl
  return localStorage.getItem(STORAGE_KEY_URL) || ''
}

export function setScriptUrl(url) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim())
}

export function hasScriptUrl() {
  return Boolean(getScriptUrl())
}

function readQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUEUE)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue))
}

export function getQueueLength() {
  return readQueue().length
}

function enqueue(payload) {
  const queue = readQueue()
  queue.push({ ...payload, _queuedAt: new Date().toISOString() })
  writeQueue(queue)
}

/**
 * Send a single payload to the Apps Script backend.
 * Uses text/plain to keep the request a "simple request" (no CORS preflight),
 * since Apps Script Web Apps don't respond to OPTIONS preflight requests.
 */
async function sendToBackend(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`Backend responded with status ${res.status}`)
  }
  const data = await res.json().catch(() => ({ result: 'success' }))
  if (data.result === 'error') {
    throw new Error(data.message || 'Backend reported an error')
  }
  return data
}

/**
 * Submit a payload (checkIn or checkOut action). If offline or the request
 * fails, the payload is queued in localStorage and retried later.
 * Returns { queued: boolean } so the UI can show appropriate feedback.
 */
export async function submitAction(payload) {
  const url = getScriptUrl()
  if (!url) {
    enqueue(payload)
    return { queued: true, reason: 'no-url' }
  }

  if (!navigator.onLine) {
    enqueue(payload)
    return { queued: true, reason: 'offline' }
  }

  try {
    await sendToBackend(url, payload)
    return { queued: false }
  } catch (err) {
    enqueue(payload)
    return { queued: true, reason: 'error', error: err }
  }
}

/**
 * Attempt to flush any queued submissions to the backend.
 * Stops at the first failure to preserve ordering; failed + remaining items stay queued.
 */
export async function syncQueue() {
  const url = getScriptUrl()
  if (!url || !navigator.onLine) return { synced: 0, remaining: getQueueLength() }

  const queue = readQueue()
  if (queue.length === 0) return { synced: 0, remaining: 0 }

  let synced = 0
  while (queue.length > 0) {
    const item = queue[0]
    try {
      // eslint-disable-next-line no-await-in-loop
      await sendToBackend(url, item)
      queue.shift()
      synced += 1
    } catch {
      break
    }
  }
  writeQueue(queue)
  return { synced, remaining: queue.length }
}
