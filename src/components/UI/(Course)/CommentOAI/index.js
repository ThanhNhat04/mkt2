'use client'
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function CommentOAI({ id, data, s }) {
  // Biến 
  const [open, setOpen] = useState(false);
  const [chat, setchat] = useState('Loading')
  const [status, setstatus] = useState('Chuyển sang văn bản')
  const [isLoading, setIsLoading] = useState(false);

  // Tương tác
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Api
  const chatGPT = async (e) => {
    setIsLoading(true)
    if (status == 'Chuyển sang văn bản') {
      if (data.Cmt && (Array.isArray(data.Cmt))) {
        const res = await fetch('/api/Openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{
              role: 'user', content:
                `Hãy chuyển các nhận xét dưới đây thành 1 văn bản nhận xét học sinh trong buổi học khoảng 100 chữ, chia nội dung nhận xét thành 3 mục cho đầu dòng: Thái độ học tập, Kết quả học tập và Điểm cần cải thiện. Không sử dụng kí tự đặc biệt trong văn bản.`
                + data.Cmt
            }]
          }),
        });
        if (!res.ok) {
          alert('Bạn không có quyền thực hiện tính năng này')
        } else {
          const datas = await res.json();
          setchat(datas.choices[0].message.content)
          setstatus('Gửi cho phụ huynh')
        }
      } else (alert('Không có nhận xét để chuyển đổi!'))
    } else {
      const getStudentOne = await fetch(`/api/Student_Read/one`, {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ID: id })
      })
      let q = await getStudentOne.json()
      console.log(q);

      let msg = `THÔNG BÁO NHẬN XÉT SAU BUỔI HỌC\n \nHọ và tên học sinh: [${q.data.Name}]\nLớp: [${s[1]}]\nBuổi học: [Ngày ${s[0].Day}]\n \nKính thưa quý phụ huynh, AI Robotic xin gửi đến quý phụ huynh một số nhận xét về buổi học hôm nay của học viên [${q.data.Name}] tại Trung tâm AI Robotic:\n \n${chat}\n \nNếu có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến buổi học hôm nay, xin quý phụ huynh vui lòng liên hệ với Trung tâm qua số điện thoại [0943325065] hoặc email [nmson@lhu.edu.vn].Xin chân thành cảm ơn quý phụ huynh!`
      msg = encodeURIComponent(msg)
      const res = await fetch(`https://script.google.com/macros/s/AKfycbxtpHTs3OPHVJ8o-OMrnckkiInbRn0kHZG5OXmZa5FYYuQmBIlA5IkYZEBEEyEMHPVQ/exec?phone=0329135161&msg=${msg}`)
      if (res.ok) {
        alert(`Gửi tin nhắn tới phụ huynh của ${q.data.Name} thành công!`)
      }
      setOpen(false);
    }
    setIsLoading(false)
  };

  // Giao diện
  return (
    <>
      <Box onClick={handleClickOpen}><CommentRoundedIcon /></Box>
      <Dialog
        fullWidth='sm'
        maxWidth='sm'
        open={open}
        onClose={handleClose}>
        <Box>
          <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>Nhận xét và ghi chú</Box>

          <Box sx={{ p: 2 }}>
            {status == 'Chuyển sang văn bản' ? <>
              {!data.Note ? <p className='text_3_m' style={{ paddingBottom: 8 }}>Không có ghi chú nào! </p> :
                <p style={{ paddingBottom: 8 }}><strong>Ghi chú:</strong> {data.Note}</p>}
              {!data.Cmt ? <p className='text_3_m'>Chưa có nhận xét học viên! </p> :
                <>
                  <p className='text_3_m'>Nhận xét buổi học:</p>
                  {!(Array.isArray(data.Cmt)) ? <p className='text_4_m'>- Nhận xét đã là bản cũ nên không thể hiển thị</p> :
                    data.Cmt.map(t => (
                      <p key={t} className='text_3_m' style={{ padding: '5px' }}>- {t}</p>
                    ))}</>}</> : <textarea
              style={{
                outline: 'none',
                width: '100%', border: 'none',
                minHeight: 100,
                fontSize: 15,
                textAlign: 'justify'
              }}
              value={chat}
              onChange={(e) => setchat(e.target.value)}
              required
            />
            }
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2, py: 1, borderTop: 'thin solid var(--background_1)', gap: 1 }}>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={chatGPT}>{status}</Button>
          </Box>
        </Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </>
  );
}