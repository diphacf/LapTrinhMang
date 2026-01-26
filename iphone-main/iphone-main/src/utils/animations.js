/**
 * animations.js - File chứa các helper functions để tạo animations với GSAP
 * 
 * File này export các function tiện ích để tạo animations:
 * - animateWithGsap: tạo animation với ScrollTrigger
 * - animateWithGsapTimeline: tạo animation sequence với Timeline
 */

// Import GSAP
import gsap from "gsap"
// Import ScrollTrigger plugin
import { ScrollTrigger } from "gsap/all"
// Đăng ký plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * animateWithGsap - Helper function để tạo animation với ScrollTrigger
 * 
 * Function này tạo animation được kích hoạt khi scroll đến element
 * 
 * @param {string} target - CSS selector của element cần animate (ví dụ: '#title', '.text')
 * @param {object} animationProps - Các thuộc tính animation (ví dụ: { opacity: 1, y: 0 })
 * @param {object} scrollProps - Các thuộc tính ScrollTrigger tùy chỉnh (ví dụ: { scrub: 5.5 })
 * 
 * @example
 * animateWithGsap('#title', { opacity: 1, y: 0 })
 * animateWithGsap('.text', { scale: 1 }, { scrub: 5.5 })
 */
export const animateWithGsap = (target, animationProps, scrollProps) => {
  gsap.to(target, {
    // Spread operator: thêm tất cả properties từ animationProps
    ...animationProps,
    scrollTrigger: {
      trigger: target, // Element trigger animation
      toggleActions: 'restart reverse restart reverse', // Hành động khi scroll
      start: 'top 85%', // Bắt đầu animation khi top của element cách top viewport 85%
      // Spread operator: thêm các scrollProps tùy chỉnh (ví dụ: scrub, start, end)
      ...scrollProps,
    }
  })
}

/**
 * animateWithGsapTimeline - Helper function để tạo animation sequence với Timeline
 * 
 * Function này tạo nhiều animations chạy cùng lúc hoặc tuần tự
 * Sử dụng cho animation phức tạp như chuyển đổi giữa các views
 * 
 * @param {object} timeline - GSAP Timeline instance
 * @param {object} rotationRef - Reference đến 3D object rotation
 * @param {number} rotationState - Góc xoay mới
 * @param {string} firstTarget - CSS selector của target đầu tiên
 * @param {string} secondTarget - CSS selector của target thứ hai
 * @param {object} animationProps - Các thuộc tính animation (ví dụ: { transform: 'translateX(-100%)' })
 * 
 * @example
 * const tl = gsap.timeline();
 * animateWithGsapTimeline(tl, small, 0, '#view1', '#view2', { transform: 'translateX(-100%)' })
 */
export const animateWithGsapTimeline = (timeline, rotationRef, rotationState, firstTarget, secondTarget, animationProps) => {
  /**
   * Animation 1: Xoay 3D object
   * rotation.y: xoay quanh trục Y
   */
  timeline.to(rotationRef.current.rotation, {
    y: rotationState, // Góc xoay mới
    duration: 1, // Thời gian 1 giây
    ease: 'power2.inOut' // Easing function
  })

  /**
   * Animation 2: Animate target đầu tiên
   * '<' nghĩa là bắt đầu cùng lúc với animation trước đó
   */
  timeline.to(
    firstTarget,
    {
      ...animationProps, // Spread animation properties
      ease: 'power2.inOut'
    },
    '<' // Bắt đầu cùng lúc với animation trước
  )

  /**
   * Animation 3: Animate target thứ hai
   * '<' nghĩa là bắt đầu cùng lúc với animation trước đó
   */
  timeline.to(
    secondTarget,
    {
      ...animationProps, // Spread animation properties
      ease: 'power2.inOut'
    },
    '<' // Bắt đầu cùng lúc với animation trước
  )
}