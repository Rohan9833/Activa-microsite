const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Submits a Request a Demo enquiry. Resolves only on a confirmed 2xx response. */
export async function submitDemoRequest(payload, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/demo-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError'
        ? 'The request timed out. Please check your connection and try again.'
        : 'We could not reach the server. Please check your connection and try again.'
    );
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }

  if (!res.ok || !data?.success) {
    const fieldErrors = {};
    (data?.errors || []).forEach((e) => {
      if (e.field && !fieldErrors[e.field]) fieldErrors[e.field] = e.message;
    });
    const fallback =
      res.status === 429
        ? 'Too many requests. Please wait a few minutes and try again.'
        : 'Something went wrong while sending your request. Please try again.';
    throw new ApiError(data?.message || fallback, { status: res.status, fieldErrors });
  }
  return data;
}
