import { getApiUrl } from "@/lib/config";

// Flag untuk mencegah multiple refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// Helper untuk handle session expired
function handleSessionExpired() {
  // Hanya redirect jika di browser (bukan di server-side)
  if (typeof window !== "undefined") {
    // Simpan URL saat ini untuk redirect setelah login
    const currentPath = window.location.pathname;
    const authPaths = ["/login", "/register", "/auth/login", "/auth/register", "/auth/verify-login", "/auth/verify-register"];

    if (!authPaths.includes(currentPath)) {
      sessionStorage.setItem("redirectAfterLogin", currentPath);
    }

    // Redirect ke halaman login
    window.location.href = "/auth/login";
  }
}

export async function apiFetch(endpoint, { redirectOnError = true, ...opts } = {}) {
  opts = { ...opts, credentials: "include" };

  const isFormData = opts.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    // Header wajib untuk bypass warning browser Ngrok saat preflight/request
    "ngrok-skip-browser-warning": "true",
    ...(opts.headers || {}),
  };

  opts.headers = headers;

  const apiBaseUrl = getApiUrl();

  async function doFetch() {
    try {
      const res = await fetch(`${apiBaseUrl}${endpoint}`, opts);
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      return { res, data };
    } catch (err) {
      console.error(`❌ Network error fetching ${apiBaseUrl}${endpoint}:`, err);
      throw err;
    }
  }

  let { res, data } = await doFetch();

  // TOKEN EXPIRED → REFRESH (dengan protection dari infinite loop)
  if (res.status === 401 && endpoint !== "/auth/refresh-token") {
    // Jika sudah ada proses refresh yang berjalan, tunggu
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        // Retry request setelah refresh selesai
        ({ res, data } = await doFetch());
      } catch (err) {
        if (redirectOnError) handleSessionExpired();
        throw new Error("Sesi login habis. Silakan login ulang.");
      }
    } else {
      // Mulai proses refresh baru
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          // Gunakan header yang sama (terutama ngrok-skip-browser-warning)
          const refreshHeaders = {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          };

          const refreshRes = await fetch(
            `${apiBaseUrl}/auth/refresh-token`,
            {
              method: "POST",
              headers: refreshHeaders,
              credentials: "include",
            }
          );

          if (!refreshRes.ok) {
            throw new Error("Refresh token failed");
          }

          return refreshRes;
        } finally {
          // Reset flag setelah 1 detik untuk allow retry
          setTimeout(() => {
            isRefreshing = false;
            refreshPromise = null;
          }, 1000);
        }
      })();

      try {
        await refreshPromise;
        // Retry original request
        ({ res, data } = await doFetch());
      } catch (err) {
        // Refresh token juga gagal, redirect ke login
        if (redirectOnError) handleSessionExpired();
        throw new Error("Sesi login habis. Silakan login ulang.");
      }
    }
  }

  if (res.ok) return data;

  if (res.status === 403 && data?.message?.includes("OTP")) {
    return data;
  }

  throw new Error(data?.message || `API error: ${res.status}`);
}
