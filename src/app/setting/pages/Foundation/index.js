import { useState } from "react";
import { Card } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Box from "@mui/material/Box";
import BorderAllRoundedIcon from '@mui/icons-material/BorderAllRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import Fount_Create from "./ui/create";
import Link from "next/link";
import Image from "next/image";
import CardContent from "@mui/material/CardContent";
import YouTubeIcon from '@mui/icons-material/YouTube';

export function Foundation({ data }) {
  const [filteredData, setFilteredData] = useState(data); // State cho dữ liệu được lọc
  const [activeFilter, setActiveFilter] = useState("all"); // State cho nút đang được chọn

  // Hàm để xử lý lọc
  const handleFilter = (type) => {
    setActiveFilter(type); // Cập nhật nút đang được chọn
    if (type === "all") {
      setFilteredData(data); // Hiển thị tất cả
    } else {
      setFilteredData(data.filter(item => item.type == type)); // Lọc theo type
    }
  };

  return (
    <Card sx={{ height: '100%', boxShadow: ' rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' }}>
      <Grid container spacing={2} sx={{ m: 0, height: '100%' }}>
        <Grid xs={2} sx={{ position: 'relative', borderRight: 'thin solid var(--background_1)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
            {/* Bộ lọc */}
            <div
              style={{
                width: 'calc(100% - 16px)',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                background: activeFilter === "all" ? 'var(--main)' : 'transparent',
                border: 'none',
                borderRadius: '3px',
                color: activeFilter === "all" ? 'white' : 'var(--text)',
                gap: 16,
                cursor: 'pointer'
              }}
              onClick={() => handleFilter("all")}
            >
              <BorderAllRoundedIcon />Tất cả
            </div>
            <div
              style={{
                width: 'calc(100% - 16px)',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                background: activeFilter === "Facebook" ? 'var(--main)' : 'transparent',
                border: 'none',
                borderRadius: '3px',
                color: activeFilter === "Facebook" ? 'white' : 'var(--text)',
                gap: 16,
                cursor: 'pointer'
              }}
              onClick={() => handleFilter("Facebook")}
            >
              <FacebookRoundedIcon />Facebook
            </div>
            <div
              style={{
                width: 'calc(100% - 16px)',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                background: activeFilter === "Youtube" ? 'var(--main)' : 'transparent',
                border: 'none',
                borderRadius: '3px',
                color: activeFilter === "Youtube" ? 'white' : 'var(--text)',
                gap: 16,
                cursor: 'pointer'
              }}
              onClick={() => handleFilter("Youtube")}
            >
              <YouTubeIcon />Youtube
            </div>
          </div>
        </Grid>
        <Grid xs={10} sx={{ position: 'relative' }}>
          <Card
            sx={{
              backgroundImage: 'url(https://static.canva.com/web/images/e733916c4616f5baa19098cc2844369b.jpg)',
              display: 'flex',
              borderRadius: '3px',
              p: 1,
              m: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <input
              type="text"
              placeholder="Nhập thông tin..."
              style={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '3px',
                padding: '10px',
                fontSize: '16px',
                width: '450px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
                e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ccc';
                e.target.style.boxShadow = 'none';
              }}
            />
            <Fount_Create />
          </Card>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              pt: 1,
              m: 1
            }}
          >
            {filteredData.map((tool, index) => {
              return (
                <Card key={index} sx={{
                  maxWidth: 280, cursor: 'pointer', ':hover': {
                    boxShadow: `rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;`
                  }
                }}>
                  <Box sx={{ position: 'relative', zIndex: 1 }}></Box>
                  <Link href={tool.link} target="_blank" rel="noopener noreferrer">
                    <div
                      style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '16/9',
                        position: 'relative',
                        zIndex: 0
                      }}
                    >
                      <Image
                        fill
                        style={{ objectFit: 'cover' }}
                        src={tool.banner}
                        alt={tool.name}
                      />
                    </div>
                  </Link>
                  <CardContent>
                    <p className="text_3" style={{ marginBottom: 12 }}>
                      {tool.name.length > 25
                        ? `${tool.name.substring(0, 25)}...`
                        : tool.name}
                    </p>
                    <p className="text_4_m">
                      {tool.description.length > 60
                        ? `${tool.description.substring(0, 60)}...`
                        : tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
