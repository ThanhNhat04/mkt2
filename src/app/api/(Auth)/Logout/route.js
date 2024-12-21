import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const u = cookieStore.get('airobotic')?.value;

  if (!u) {
    return new Response(JSON.stringify({ error: 'No refresh token found' }), { status: 401 });
  }

  cookieStore.set('airobotic', '', { httpOnly: true, path: '/', maxAge: 0 });
  return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
}