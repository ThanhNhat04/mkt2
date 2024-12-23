import Tool_Create from './ui/Tool_Create';
import { Tool_Read_all } from '@/app/data';
import { Box, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteButton from './ui/Tool_Delete';

export default async function ToolPage() {
  let data = await Tool_Read_all()

  return (
    <>
      <Tool_Create  data={data}/>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {data.map((data, index) => {
          return (
            <Card key={index} sx={{ maxWidth: 280, cursor: 'pointer' }}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  sx={{
                    position: 'absolute', top: 8, right: 8, minWidth: 28, minHeight: 28, width: 28, height: 28, backgroundColor: 'primary.main', borderRadius: 1, color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  <EditNoteIcon />
                </Button>
                <DeleteButton datax={data._id} />
              </Box>

              <a href={data.Tool} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={data.Image}
                  alt={data.Name}
                />
              </a>

              <CardContent>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: 16 }}>
                  {data.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.Description}
                </Typography>
              </CardContent>
            </Card>)
        })}
      </Box>
    </>
  );
}
