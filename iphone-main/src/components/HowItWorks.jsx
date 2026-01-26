/**
 * HowItWorks.jsx - Component phần "How It Works" (Cách hoạt động)
 * 
 * Component này hiển thị:
 * - Hình ảnh chip A17 Pro với animation
 * - Tiêu đề và mô tả về chip A17 Pro
 * - Video game demo (Honkai: Star Rail) trong khung iPhone
 * - Text mô tả về hiệu suất GPU
 * - Sử dụng GSAP ScrollTrigger để tạo animation khi scroll
 */

// Import React và useRef hook
import React, { useRef } from 'react'
// Import hình ảnh và video
import { chipImg, frameImg, frameVideo } from '../utils'
// Import GSAP và useGSAP hook
import { useGSAP } from '@gsap/react'
import gsap from 'gsap';
// Import helper function để tạo animation
import { animateWithGsap } from '../utils/animations';

/**
 * Component HowItWorks - Phần giải thích cách hoạt động
 * 
 * @returns {JSX.Element} - Trả về section với chip, video và mô tả
 */
const HowItWorks = () => {
  /**
   * useRef - Reference đến video element để có thể điều khiển
   */
  const videoRef = useRef();

  /**
   * useGSAP - Hook để tạo animations với GSAP
   * 
   * Animations:
   * 1. Chip image: scale từ 2 về 1 và fade in khi scroll
   * 2. Text elements: fade in và slide up khi scroll
   */
  useGSAP(() => {
    // Animation cho hình ảnh chip
    // gsap.from(): animation từ trạng thái ban đầu đến trạng thái hiện tại
    gsap.from('#chip', {
      scrollTrigger: {
        trigger: '#chip', // Element trigger animation
        start: '20% bottom' // Bắt đầu khi element cách bottom 20%
      },
      opacity: 0, // Bắt đầu từ trong suốt
      scale: 2, // Bắt đầu từ scale 2 (phóng to gấp đôi)
      duration: 2, // Thời gian animation 2 giây
      ease: 'power2.inOut' // Easing function
    })

    // Animation cho các text elements
    // '.g_fadeIn' là class selector cho các text cần animate
    animateWithGsap('.g_fadeIn', {
      opacity: 1, // Hiển thị
      y: 0, // Di chuyển về vị trí ban đầu (từ dưới lên)
      duration: 1, // Thời gian 1 giây
      ease: 'power2.inOut'
    })
  }, []); // Chạy 1 lần khi component mount

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        {/* Container hình ảnh chip A17 Pro */}
        {/* id="chip" để GSAP có thể animate */}
        <div id="chip" className="flex-center w-full my-20">
          <img src={chipImg} alt="chip" width={180} height={180} />
        </div>

        {/* Container tiêu đề và subtitle */}
        <div className="flex flex-col items-center">
          <h2 className="hiw-title">
            A17 Pro chip.
            <br /> A monster win for gaming.
          </h2>

          <p className="hiw-subtitle">
            It's here. The biggest redesign in the history of Apple GPUs.
          </p>
        </div>

        {/* Container video game demo */}
        <div className="mt-10 md:mt-20 mb-14">
          <div className="relative h-full flex-center">
            {/* Khung iPhone (frame) */}
            <div className="overflow-hidden">
              <img 
                src={frameImg}
                alt="frame"
                className="bg-transparent relative z-10"
              />
            </div>
            {/* Video game demo bên trong khung */}
            <div className="hiw-video">
              <video className="pointer-events-none" playsInline preload="none" muted autoPlay ref={videoRef}>
                <source src={frameVideo} type="video/mp4" />
              </video>
            </div>
          </div>
          {/* Tên game */}
          <p className="text-gray font-semibold text-center mt-3">Honkai: Star Rail</p>
        </div>

        {/* Container text mô tả */}
        <div className="hiw-text-container">
          {/* Text mô tả về hiệu suất */}
          <div className="flex flex-1 justify-center flex-col">
            {/* class="g_fadeIn" để GSAP có thể animate */}
            <p className="hiw-text g_fadeIn">
              A17 Pro is an entirely new class of iPhone chip that delivers our {' '}
              <span className="text-white">
                best graphic performance by far
              </span>.
            </p>

            <p className="hiw-text g_fadeIn">
              Mobile {' '}
              <span className="text-white">
                games will look and feel so immersive
              </span>,
              with incredibly detailed environments and characters.
            </p>
          </div>

          {/* Thông tin GPU */}
          <div className="flex-1 flex justify-center flex-col g_fadeIn">
            <p className="hiw-text">New</p>
            <p className="hiw-bigtext">Pro-class GPU</p>
            <p className="hiw-text">with 6 cores</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks