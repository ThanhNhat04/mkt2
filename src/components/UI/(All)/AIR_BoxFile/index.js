import Box from "@mui/material/Box"
import Link from "@mui/material/Link"
export default function AIR_BoxFile({ type, name, href }) {
  return (
    <>
      <Link href={href} target="_blank" style={{ textDecoration: 'unset' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: 1,
          p: 2,
          boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
          borderRadius: '6px',

        }}>
          <img
            src={type == 'Image' ? 'https://assets.minimals.cc/public/assets/icons/files/ic-img.svg' :
              type == 'Ppt' ? 'https://assets.minimals.cc/public/assets/icons/files/ic-power_point.svg' :
                type = 'Video' ? 'https://assets.minimals.cc/public/assets/icons/files/ic-video.svg' :
                  'https://assets.minimals.cc/public/assets/icons/files/ic-zip.svg'}
            alt='dsds'
            loading="lazy"
          />
          <Box>{name}</Box>
        </Box>
      </Link>
    </>
  )
}