import Box from '@mui/material/Box'
import '@/style/index.css'

export default async function Page({ children }) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 40px)',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
      className="Wrap_Scroll_n"
    >
      {children}
    </Box>)
}
