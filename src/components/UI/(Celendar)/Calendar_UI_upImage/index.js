'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import ImageIcon from '@mui/icons-material/Image'
import AssignmentIcon from '@mui/icons-material/Assignment'
import styles from './index.module.css'
import { SVG_image, SVG_x } from '@/components/svg'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import '@/style/index.css'
import Link from 'next/link'

export default function UI_Calendar_upImage({ lesson, course, url }) {
  const [open, setOpen] = useState(false)
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [openCmtDialog, setOpenCmtDialog] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpenImageDialog = () => setOpenImageDialog(true)
  const handleCloseImageDialog = () => setOpenImageDialog(false)

  const handleOpenCmtDialog = () => setOpenCmtDialog(true)
  const handleCloseCmtDialog = () => setOpenCmtDialog(false)

  const options = [
    {
      label: 'Hình ảnh',
      icon: <ImageIcon className={styles.optionIcon} />,
      onClick: handleOpenImageDialog,
    },
    {
      label: 'Phiếu đánh giá',
      icon: <AssignmentIcon className={styles.optionIcon} />,
      onClick: handleOpenCmtDialog,
    },
  ]
  return (
    <>
      <Box className={styles.box} onClick={handleClickOpen}>
        <img
          src="https://assets.minimals.cc/public/assets/icons/files/ic-img.svg"
          alt="Hình ảnh"
          loading="lazy"
        />
        <Box>Hình ảnh</Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box className={styles.dialogContent}>
          <Box className={styles.titlePopup}>Tài nguyên buổi học</Box>
          <Box className={styles.optionsContainer}>
            <Box
              className={styles.optionBox}
              onClick={handleOpenImageDialog}
            >
              <ImageIcon className={styles.optionIcon} />
              <Box className={styles.optionText}>Hình ảnh</Box>
            </Box>

            <Link className={styles.optionBox} href={'https://drive.google.com/drive/u/0/folders/' + url} target="_blank" rel="noopener noreferrer">
              <AssignmentIcon className={styles.optionIcon} />
              <p className={styles.optionText}>Phiếu đánh giá</p>
            </Link>

          </Box>
        </Box>
      </Dialog >

      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        maxWidth="lg"
        fullWidth
      >
        <Box className={styles.dialogContent}>
          <Image_Pop url={url} lesson={lesson} course={course} />
        </Box>
      </Dialog>

      <Dialog
        open={openCmtDialog}
        onClose={handleCloseCmtDialog}
        maxWidth="lg"
        fullWidth
      >
        <Box className={styles.dialogContent}>
        </Box>
      </Dialog>
    </>
  )
}

const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  const kb = sizeInBytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

const color_main = '#03abe3'
const color_background = '#333333'
const color_text_d = '#999999'
const color_text_l = 'white'
const size = '16px'


export function Image_Pop({ lesson, url, course }) {
  const [images, setImages] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleFileChange = (event) => {
    const files = event.target.files;
    let validFiles = [];
    let invalidFiles = false;
    if (files && files.length > 0) {
      for (let file of files) {
        if (file.type.startsWith('image/')) {
          validFiles.push({
            url: URL.createObjectURL(file),
            name: file.name,
            size: formatFileSize(file.size),
          });
        } else {
          invalidFiles = true;
        }
      }
      if (invalidFiles) { setErrorMessage('Vui lòng chỉ chọn các tệp hình ảnh.') }
      else { setErrorMessage('') }
      setImages((prevImages) => [...prevImages, ...validFiles]);
    }
  };
  const handleRemoveImage = (index) => setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  const handleSaveImages = async () => {
    setIsLoading(true);
    if (images.length === 0) {
      console.error('Không có hình ảnh nào để tải lên.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('folderId', url);
      formData.append('courseId', course);
      formData.append('lessonId', lesson)
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i].url);
        const blob = await response.blob();
        formData.append('file', new File([blob], images[i].name, { type: blob.type }));
      }

      const response = await fetch('/api/Calendar_Resources/updateImage', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImages([]);
      } else {
        const error = await response.json();
        alert(`Lỗi khi tải lên: ${error.error}`);
      }
    } catch (error) {
      alert('Lỗi khi lưu hình ảnh. Vui lòng thử lại.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <div style={{ borderRadius: 16, width: 'calc(100% - 32px)', display: 'flex', background: 'white', padding: 16 }}>
        <label className="upload-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', border: '2px dashed #ccc', borderRadius: '10px', cursor: 'pointer' }}>
          <SVG_image w={55} h={55} />
          <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          <p style={{ padding: '8px 12px 26px 0', color: `${color_background}` }}>Kéo và Thả, Tải lên hoặc Dán hình ảnh</p>
          <p style={{ padding: '8px 20px', fontSize: `${size}`, backgroundColor: `${color_main}`, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Tải ảnh lên</p>
        </label>
        {images.length ?
          <div style={{ marginLeft: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 6, }}>
            <div className="image-preview Wrap_Scroll" style={{
              width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: 8,
              alignItems: 'start', overflow: 'hidden', overflowY: 'scroll', height: 300, paddingRight: 12, paddingBottom: 6
            }}>
              {images.map((image, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, alignItems: 'center', height: 'max-content', width: 'calc(100% - 16px)', border: '1px solid #cccccc', borderRadius: 8 }}>
                  <div style={{ height: 'max-content', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img key={index} src={image.url} alt={`Upload Preview ${index}`} style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '5px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p>{image.name}</p>
                      <p style={{ color: '#606060', fontSize: '14px' }}>Kích thước: {image.size}</p>
                    </div>
                  </div>
                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => handleRemoveImage(index)}>
                    <SVG_x w={25} h={25} c={'#cccccc'} />
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              padding: '8px', border: 'none', borderRadius: 4, backgroundColor: `${color_main}`, color: `${color_text_l}`,
              fontWeight: 500, cursor: 'pointer', fontSize: `${size}`
            }} onClick={handleSaveImages}>
              Lưu hình ảnh
            </button>
          </div> : null
        }
      </div >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}