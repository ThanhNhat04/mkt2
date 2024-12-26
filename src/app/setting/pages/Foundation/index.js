import { Card } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import BorderAllRoundedIcon from '@mui/icons-material/BorderAllRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import Fount_Create from "./ui/create";

export function Foundation() {
  return (
    <Card sx={{ height: '100%', boxShadow: ' rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' }}>
      <Grid container spacing={2} sx={{ m: 0, height: '100%' }}>
        <Grid xs={2} sx={{ position: 'relative', borderRight: 'thin solid var(--background_1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
            <div style={{
              width: '90%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              background: 'var(--main)',
              border: 'thin solid var(--main)',
              borderRadius: '8px',
              color: 'white',
              gap: 16,
              cursor: 'pointer'
            }}><BorderAllRoundedIcon />Tất cả</div>
            <div style={{
              width: '90%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              border: 'thin solid var(--main)',
              borderRadius: '8px',
              gap: 16,
              cursor: 'pointer'
            }}>< FacebookRoundedIcon />Facebook</div>

          </div>
        </Grid>
        <Grid xs={10} sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              borderRadius: '8px',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              p: 1,
              backgroundColor: 'white',
              m: 1,
              justifyContent: 'space-between',
            }}
          >
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              size="small"
              sx={{ mr: 2, width: '400px', color: 'var(--main)' }}
            />
            <Fount_Create />
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}