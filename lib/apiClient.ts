const DEFAULT_BACKEND_URL = 'https://virtua-health-consultancy-server.onrender.com';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_URL).replace(/\/$/, '');

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
  retries = 2
): Promise<Response> {
  const baseInit: RequestInit = {
    credentials: 'include', // Ensures cross-domain cookies are sent to Render
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  };

  let url: RequestInfo;
  if (typeof input === 'string') {
    if (input.startsWith('http')) {
      url = input;
    } else {
      const path = input.startsWith('/') ? input : `/${input}`;
      url = `${API_URL}${path}`;
    }
  } else {
    url = input;
  }

  try {
    let res = await fetch(url, baseInit);

    // If access token expired, attempt automatic session refresh
    if (res.status === 401) {
      try {
        const refreshUrl = `${API_URL}/api/refresh`;
        const refreshRes = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshRes.ok) {
          // Retry original request after token refresh succeeds
          res = await fetch(url, baseInit);
        }
      } catch (refreshErr) {
        console.error('[apiFetch] Session refresh failed:', refreshErr);
      }
    }

    return res;
  } catch (err) {
    // Retry if Render is waking up from a cold start (30-50s spin up time)
    if (retries > 0) {
      console.warn(`[apiFetch] Fetch failed (Render waking up?). Retrying in 3s... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return apiFetch(input, init, retries - 1);
    }
    throw err;
  }
}

export default apiFetch;