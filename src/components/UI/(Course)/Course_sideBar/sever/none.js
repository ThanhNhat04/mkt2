import Image from "next/image"

export default function None() {
  return (
    <div style={{ height: "60%", flexDirection: 'column' }} className='flexCenter'>
      <h3 className='Title_Popup'>Không có dự án nào để hiển thị</h3>
      <p style={{ color: 'red' }}>(Chỉ những dự án bạn có tham gia mới được hiển thị)</p>
    </div>
  )
}