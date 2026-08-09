const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit,
  retries = 2
): Promise<Response> {
  const baseInit: RequestInit = {
    credentials: 'include',
    ...init,
  };

  let url: RequestInfo;
  if (typeof input === 'string') {
    url = input.startsWith('/') && API_URL ? `${API_URL}${input}` : input;
  } else {
    url = input;
  }

  try {
    let res = await fetch(url, baseInit);

    if (res.status === 401) {
      try {
        const refreshUrl = API_URL ? `${API_URL}/api/refresh` : '/api/refresh';
        const refresh = await fetch(refreshUrl, {
          method: 'POST',
          credentials: 'include',
        });

        if (refresh.ok) {
          res = await fetch(url, baseInit);
        }
      } catch (err) {
        console.error('[apiFetch] Session refresh failed:', err);
      }
    }

    return res;
  } catch (err) {
    // Retry if Render is waking up from a cold start
    if (retries > 0) {
      console.warn(`[apiFetch] Fetch failed (Render waking up?). Retrying... (${retries} left)`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3s
      return apiFetch(input, init, retries - 1);
    }
    throw err;
  }
}

export default apiFetch;