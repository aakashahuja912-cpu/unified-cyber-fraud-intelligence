/**
 * Base API Service for communicating with the fullstack Express backend.
 */

const API_BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('apex_auth_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('apex_auth_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('apex_auth_token');
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Connects to the Server-Sent Events stream for real-time telemetry updates.
 */
export function subscribeToTelemetry(onMessage: (event: any) => void): () => void {
  const eventSource = new EventSource(`${API_BASE_URL}/stream`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error('Failed to parse SSE message:', e);
    }
  };

  eventSource.onerror = (err) => {
    console.error('SSE Stream error, reconnecting...', err);
  };

  return () => {
    eventSource.close();
  };
}
