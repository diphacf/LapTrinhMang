/**
 * Hero.jsx - Component phần banner chính (Hero Section)
 * 
 * Component này hiển thị:
 * - Video hero tự động phát
 * - Tiêu đề "iPhone 15 Pro"
 * - Nút "Buy" và thông tin giá
 * - Sử dụng GSAP để tạo animation khi trang load
 * - Tự động chuyển đổi video dựa trên kích thước màn hình
 */

// Import GSAP - thư viện animation mạnh mẽ
import gsap from 'gsap';
// Import useGSAP hook - hook đặc biệt để sử dụng GSAP với React
import { useGSAP } from '@gsap/react';
// Import các video hero (video lớn và video nhỏ cho mobile)
import { heroVideo, smallHeroVideo } from '../utils';
// Import React hooks
// - useEffect: để thực hiện side effects (thêm/xóa event listeners)
// - useState: để quản lý state (trạng thái) của component
import { useEffect, useState } from 'react';

/**
 * Component Hero - Phần banner chính
 * 
 * @returns {JSX.Element} - Trả về section hero với video và CTA
 */
const Hero = () => {
  /**
   * useState - Hook để quản lý state (trạng thái) của component
   * 
   * videoSrc: biến state lưu đường dẫn video hiện tại
   * setVideoSrc: function để cập nhật giá trị videoSrc
   * 
   * Khởi tạo: kiểm tra chiều rộng màn hình
   * - Nếu < 760px: dùng video nhỏ (smallHeroVideo)
   * - Nếu >= 760px: dùng video lớn (heroVideo)
   */
  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo)

  /**
   * handleVideoSrcSet - Function xử lý thay đổi video khi resize màn hình
   * 
   * Function này được gọi khi người dùng thay đổi kích thước cửa sổ trình duyệt
   * Mục đích: đảm bảo hiển thị video phù hợp với kích thước màn hình
   */
  const handleVideoSrcSet = () => {
    // Kiểm tra chiều rộng màn hình
    if(window.innerWidth < 760) {
      // Màn hình nhỏ (mobile): dùng video nhỏ để tối ưu hiệu suất
      setVideoSrc(smallHeroVideo)
    } else {
      // Màn hình lớn (desktop/tablet): dùng video lớn chất lượng cao
      setVideoSrc(heroVideo)
    }
  }

  /**
   * useEffect - Hook để thực hiện side effects
   * 
   * useEffect nhận 2 tham số:
   * 1. Function thực thi
   * 2. Dependency array (mảng phụ thuộc) - [] nghĩa là chỉ chạy 1 lần khi component mount
   * 
   * Trong function:
   * - Thêm event listener 'resize' để lắng nghe khi người dùng thay đổi kích thước cửa sổ
   * - Return function cleanup: xóa event listener khi component unmount (tránh memory leak)
   */
  useEffect(() => {
    // Thêm event listener để lắng nghe sự kiện resize
    window.addEventListener('resize', handleVideoSrcSet);

    // Cleanup function: chạy khi component bị unmount
    // Quan trọng: phải xóa event listener để tránh memory leak
    return () => {
      window.removeEventListener('resize', handleVideoSrcSet)
    }
  }, []) // Dependency array rỗng = chỉ chạy 1 lần khi component mount

  /**
   * useGSAP - Hook đặc biệt để sử dụng GSAP animation với React
   * 
   * useGSAP tương tự useEffect nhưng được tối ưu cho GSAP
   * Tự động cleanup animations khi component unmount
   */
  useGSAP(() => {
    // Animation cho tiêu đề "iPhone 15 Pro"
    // gsap.to() tạo animation từ trạng thái hiện tại đến trạng thái mới
    // '#hero' là selector CSS để tìm element có id="hero"
    // opacity: 1 - làm cho element hiển thị (từ 0 đến 1)
    // delay: 2 - đợi 2 giây trước khi bắt đầu animation
    gsap.to('#hero', { opacity: 1, delay: 2 })
    
    // Animation cho phần CTA (Call To Action - nút Buy)
    // opacity: 1 - hiển thị
    // y: -50 - di chuyển lên trên 50px (từ vị trí ban đầu)
    // delay: 2 - đợi 2 giây
    gsap.to('#cta', { opacity: 1, y: -50, delay: 2 })
  }, []) // Chạy 1 lần khi component mount

  return (
    // Section hero với background đen
    <section className="w-full nav-height bg-black relative">
      {/* Container chứa video và tiêu đề */}
      <div className="h-5/6 w-full flex-center flex-col">
        {/* Tiêu đề "iPhone 15 Pro" */}
        {/* id="hero" để GSAP có thể tìm và animate element này */}
        <p id="hero" className="hero-title">iPhone 15 Pro</p>
        
        {/* Container video */}
        <div className="md:w-10/12 w-9/12">
          {/* 
            Thẻ <video> để hiển thị video
            - autoPlay: tự động phát khi load
            - muted: tắt tiếng (bắt buộc để autoPlay hoạt động trên nhiều trình duyệt)
            - playsInline: phát inline trên mobile (không fullscreen)
            - pointer-events-none: vô hiệu hóa tương tác chuột (không thể click/pause)
            - key={videoSrc}: khi videoSrc thay đổi, React sẽ re-render video element
          */}
          <video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* CTA (Call To Action) - Phần nút mua hàng */}
      {/* 
        id="cta" để GSAP có thể animate
        opacity-0: ẩn ban đầu (sẽ được GSAP làm hiện)
        translate-y-20: dịch chuyển xuống 20px ban đầu
      */}
      <div
        id="cta"
        className="flex flex-col items-center opacity-0 translate-y-20"
      >
        {/* Link đến phần highlights */}
        <a href="#highlights" className="btn">Buy</a>
        {/* Thông tin giá */}
        <p className="font-normal text-xl">From $199/month or $999</p>
      </div>
    </section>
  )
}

export default Hero