/**
 * Highlights.jsx - Component phần highlights (điểm nổi bật)
 * 
 * Component này hiển thị:
 * - Tiêu đề "Get the highlights"
 * - Các link "Watch the film" và "Watch the event"
 * - VideoCarousel component để hiển thị carousel video
 * - Sử dụng GSAP để tạo animation khi scroll vào view
 */

// Import GSAP và useGSAP hook để tạo animations
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
// Import các hình ảnh icon
import { rightImg, watchImg } from "../utils"

// Import component VideoCarousel để hiển thị carousel video
import VideoCarousel from './VideoCarousel';

/**
 * Component Highlights - Phần highlights
 * 
 * @returns {JSX.Element} - Trả về section highlights với tiêu đề, links và video carousel
 */
const Highlights = () => {
  /**
   * useGSAP - Hook để tạo animations với GSAP
   * 
   * Animations được tạo khi component mount:
   * 1. Tiêu đề "Get the highlights" fade in và slide up
   * 2. Các link fade in và slide up với stagger effect (lần lượt)
   */
  useGSAP(() => {
    // Animation cho tiêu đề
    // opacity: 1 - hiển thị
    // y: 0 - di chuyển về vị trí ban đầu (từ dưới lên)
    gsap.to('#title', { opacity: 1, y: 0 })
    
    // Animation cho các link
    // '.link' là selector CSS class để tìm tất cả elements có class="link"
    // stagger: 0.25 - mỗi element sẽ animate sau element trước 0.25 giây (hiệu ứng lần lượt)
    // duration: 1 - thời gian animation 1 giây
    gsap.to('.link', { opacity: 1, y: 0, duration: 1, stagger: 0.25 })
  }, []) // Chạy 1 lần khi component mount

  return (
    // Section highlights
    // id="highlights" để có thể link đến từ các phần khác (ví dụ: href="#highlights")
    // overflow-hidden: ẩn phần tràn ra ngoài
    <section id="highlights" className="w-screen overflow-hidden h-full common-padding bg-zinc">
      <div className="screen-max-width">
        {/* Container chứa tiêu đề và links */}
        <div className="mb-12 w-full md:flex items-end justify-between">
          {/* Tiêu đề "Get the highlights" */}
          {/* id="title" để GSAP có thể animate */}
          <h1 id="title" className="section-heading">Get the highlights.</h1>

          {/* Container chứa các links */}
          <div className="flex flex-wrap items-end gap-5">
            {/* Link "Watch the film" */}
            <p className="link">
              Watch the film
              <img src={watchImg} alt="watch" className="ml-2" />
            </p>
            {/* Link "Watch the event" */}
            <p className="link">
              Watch the event
              <img src={rightImg} alt="right" className="ml-2" />
            </p>
          </div>
        </div>

        {/* Component VideoCarousel - hiển thị carousel video highlights */}
        <VideoCarousel />
      </div>
    </section>
  )
}

export default Highlights