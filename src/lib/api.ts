const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:3001';

export async function createSession(idToken: string) {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to create session');
  }

  return response.json();
}

export async function verifySession() {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.user;
}

export async function removeSession() {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function verifyAdmin() {
  const response = await fetch(`${API_BASE_URL}/admin/test`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
} 