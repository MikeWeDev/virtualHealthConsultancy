export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const baseInit: RequestInit = { credentials: 'include', ...init };

  let res = await fetch(input, baseInit);

  if (res.status === 401) {
    // try refreshing once
    try {
      const refresh = await fetch('/api/refresh', { credentials: 'include' });
      if (refresh.ok) {
        // retry original request
        res = await fetch(input, baseInit);
      }
    } catch (err) {
      // fallthrough
    }
  }

  return res;
}

export default apiFetch;
