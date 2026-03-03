import api from '@/services/api';

// A simple helper that attempts to determine whether the current browser
// session holds valid authentication.  Because the server issues an
// httpOnly "token" cookie, we cannot read it directly from JS. The safest
// way to verify auth state is to make a lightweight request to the
// /auth/me endpoint.  The function returns a Promise<boolean> so callers
// can await the result, but we also expose a synchronous fallback that
// checks localStorage for a marker (set by the client) to avoid an extra
// network round trip in some cases.

export async function isAuthenticated() {
  // quick local marker
  if (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') {
    return true;
  }

  try {
    const res = await api.get('/auth/me');
    return !!res?.data?.data;
  } catch {
    return false;
  }
}

export function markAuthenticated(flag = true) {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('isAuthenticated', flag ? 'true' : 'false'); } catch {}
  }
}