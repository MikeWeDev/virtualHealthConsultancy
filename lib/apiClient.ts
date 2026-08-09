const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const baseInit: RequestInit = {
    credentials: 'include',
    ...init,
  };

  const url =
    typeof input === 'string' && input.startsWith('/')
      ? `${API_URL}${input}`
      : input;

  let res = await fetch(url, baseInit);

  if (res.status === 401) {
    // Try refreshing once
    try {
      const refresh = await fetch(`${API_URL}/api/refresh`, {
        credentials: 'include',
      });

      if (refresh.ok) {
        // Retry original request
        res = await fetch(url, baseInit);
      }
    } catch (err) {
      // Fall through
    }
  }

  return res;
}

export default apiFetch;