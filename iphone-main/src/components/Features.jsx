/**
 * Features.jsx - Component phần tính năng (Features Section)
 * 
 * Component này hiển thị:
 * - Tiêu đề "Explore the full story"
 * - Video giới thiệu về titanium
 * - Hình ảnh và text mô tả tính năng titanium
 * - Sử dụng GSAP ScrollTrigger để tạo animation khi scroll
 */

// Import GSAP và useGSAP hook
import { useGSAP } from '@gsap/react'
// Import React và useRef hook
// useRef: để tạo reference đến DOM element (trong trường hợp này là video element)
import React, { useRef } from 'react'
// Import helper function để tạo animation với GSAP
import { animateWithGsap } from '../utils/animations';
// Import hình ảnh và video
import { explore1Img, explore2Img, exploreVideo } from '../utils';
import gsap from 'gsap';

/**
 * Component Features - Phần tính năng
 * 
 * @returns {JSX.Element} - Trả về section features với video và mô tả
 */
const Features = () => {
  /**
   * useRef - Hook để tạo reference đến DOM element
   * 
   * videoRef: reference đến thẻ <video> để có thể điều khiển video programmatically
   * Sử dụng: videoRef.current.play() để phát video
   */
  const videoRef = useRef();

  /**
   * useGSAP - Hook để tạo animations với GSAP
   * 
   * Các animations:
   * 1. Video animation với ScrollTrigger
   * 2. Tiêu đề fade in và slide up
   * 3. Hình ảnh scale và fade in khi scroll
   * 4. Text fade in và slide up
   */
  useGSAP(() => {
    // Animation cho video với ScrollTrigger
    // ScrollTrigger: animation được kích hoạt khi scroll đến element
    gsap.to('#exploreVideo', {
      scrollTrigger: {
        trigger: '#exploreVideo', // Element trigger animation
        toggleActions: 'play pause reverse restart', // Hành động khi scroll
        start: '-10% bottom', // Bắt đầu animation khi element cách bottom 10%
      },
      // onComplete: callback khi animation hoàn thành
      onComplete: () => {
        // Phát video khi animation hoàn thành
        videoRef.current.play();
      }
    })

    // Animation cho tiêu đề
    // animateWithGsap là helper function tự định nghĩa (xem utils/animations.js)
    animateWithGsap('#features_title', { y:0, opacity:1})
    
    // Animation cho hình ảnh với scrub effect
    // scrub: 5.5 - animation được đồng bộ với scroll (scroll 5.5 giây = animation 1 giây)
    // scale: 1 - phóng to từ 0 đến 1
    // ease: 'power1' - easing function (cách animation di chuyển)
    animateWithGsap(
      '.g_grow', // Selector cho các hình ảnh
      { scale: 1, opacity: 1, ease: 'power1' },
      { scrub: 5.5 } // Scroll-triggered animation
    );
    
    // Animation cho text
    animateWithGsap(
      '.g_text', // Selector cho các text
      {y:0, opacity: 1, ease: 'power2.inOut', duration: 1}
    )
  }, []); // Chạy 1 lần khi component mount

  return (
    // Section features với background zinc
    <section className="h-full common-padding bg-zinc relative overflow-hidden">
      <div className="screen-max-wdith">
        {/* Container tiêu đề */}
        <div className="mb-12 w-full">
          <h1 id="features_title" className="section-heading">Explore the full story.</h1>
        </div>
        
        {/* Container chính chứa nội dung */}
        <div className="flex flex-col justify-center items-center overflow-hidden">
          {/* Tiêu đề lớn "iPhone. Forged in titanium." */}
          <div className="mt-32 mb-24 pl-24">
            <h2 className="text-5xl lg:text-7xl font-semibold">iPhone.</h2>
            <h2 className="text-5xl lg:text-7xl font-semibold">Forged in titanium.</h2>
          </div>
/sfsfsef/
          {/* Container video và nội dung */}
          <div className="flex-center flex-col sm:px-10">
            {/* Video explore */}
            <div className="relative h-[50vh] w-full flex items-center">
              {/* 
                Video element
                - id="exploreVideo": để GSAP có thể tìm và animate
                - ref={videoRef}: gán reference để có thể điều khiển video
                - preload="none": không tải video trước (tối ưu hiệu suất)
                - playsInline: phát inline trên mobile
              */}
              <video playsInline id="exploreVideo" className="w-full h-full object-cover object-center" preload="none" muted autoPlay ref={videoRef}>
                <source src={exploreVideo} type="video/mp4" />
              </video>
            </div>

            {/* Container hình ảnh và text */}
            <div className="flex flex-col w-full relative">
              {/* Container 2 hình ảnh titanium */}
              <div className="feature-video-container">
                {/* Hình ảnh titanium 1 */}
                <div className="overflow-hidden flex-1 h-[50vh]">
                  {/* class="g_grow" để GSAP có thể animate */}
                  <img src={explore1Img} alt="titanium" className="feature-video g_grow" />
                </div>
                {/* Hình ảnh titanium 2 */}
                <div className="overflow-hidden flex-1 h-[50vh]">
                  <img src={explore2Img} alt="titanium 2" className="feature-video g_grow" />
                </div>
              </div>

              {/* Container text mô tả */}
              <div className="feature-text-container">
                {/* Text mô tả 1 */}
                <div className="flex-1 flex-center">
                  {/* class="g_text" để GSAP có thể animate */}
                  <p className="feature-text g_text">
                    iPhone 15 Pro is {' '}
                    {/* span với text-white để highlight phần quan trọng */}
                    <span className="text-white">
                      the first iPhone to feature an aerospace-grade titanium design
                    </span>,
                    using the same alloy that spacecrafts use for missions to Mars.
                  </p>
                </div>

                {/* Text mô tả 2 */}
                <div className="flex-1 flex-center">
                  <p className="feature-text g_text">
                    Titanium has one of the best strength-to-weight ratios of any metal, making these our {' '}
                    <span className="text-white">
                      lightest Pro models ever.
                    </span>
                    You'll notice the difference the moment you pick one up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features