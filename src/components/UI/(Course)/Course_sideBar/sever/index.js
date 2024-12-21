import Box from '@mui/material/Box';

export default function Nav({ status, icon, title, sl }) {
  return (
    <>
      {status ?
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderRight: '1px solid #e5e6e8',
          backgroundColor: 'var(--main)',
          py: 1,
          borderRadius: '6px',
          color: 'var(--main)',
        }}>
          <Box sx={{ ml: '24px' }}>
            <Box sx={{ fontWeight: 'bold', fontSize: '32px', color: 'white' }}>{sl}</Box>
            <Box sx={{ color: 'white' }}>{title}</Box>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: '3px',
              backgroundColor: 'var(--background)',
              mr: '24px'
            }} width={25} height={25} className="flexCenter">
            {icon}
          </Box>
        </Box> :
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderRight: '1px solid #e5e6e8',
          cursor: 'pointer',
          py: 1,
        }}>
          <Box sx={{ ml: '24px' }}>
            <Box sx={{ fontWeight: 'bold', fontSize: '32px', color: 'vamColor.text_Title' }}>{sl}</Box>
            <Box sx={{ color: 'text.secondary' }}>{title}</Box>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: '3px',
              backgroundColor: 'vamColor.background',
              mr: '24px'
            }} width={25} height={25} className="flexCenter">
            {icon}
          </Box>
        </Box>}
    </>

  )
}