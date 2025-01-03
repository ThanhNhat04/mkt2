import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import SideBar from '@/components/UI/(All)/AIR_SideBar';
import Login from '@/page/Login';
import '@/style/index.css';
import Box from '@mui/material/Box';
import { cookies } from 'next/headers';
import Script from 'next/script';

export const metadata = {
  title: 'Digi Marketing - Tasks'
};

export default async function RootLayout({ children }) {
  const token = cookies().get('airobotic')?.value;

  const response = await fetch(`${process.env.URL}/api/CheckUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ source: 1 }),
    cache: 'no-store'
  });

  let data = null;

  if (response.ok) {
    const result = await response.json();
    if (result.air === 2) {
      data = result.data;
    }
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, height: '100vh', background: 'var(--background)' }}>
        <AppRouterCacheProvider>
          {data ? (
            <div style={{ height: '100%', width: '100%' }}>
              <SideBar data={data} token={token} />
              <div style={{ marginLeft: '72px', height: '100%' }}>
                <Box
                  sx={{
                    height: 'calc(100% - 40px)',
                    width: 'calc(100% - 32px)',
                    padding: '16px 16px 8px 16px',
                    overflow: 'hidden',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { width: '0' },
                  }}
                >
                  {children}
                  {/* <Script
                    src="https://dl.dropboxusercontent.com/scl/fi/bzmccyt3sba7l4ezzq6ap/chatbot.js?rlkey=ghbs9b99bzfnej2dp73bkmo68&st=l1doxl7e&dl=1"
                    strategy="afterInteractive"
                  /> */}
                </Box>
              </div>
            </div>
          ) : (
            <Login />
          )}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
