/**
 * VideoCarousel.jsx - Component carousel video highlights
 * 
 * Component này hiển thị:
 * - Carousel với nhiều video highlights
 * - Tự động chuyển video khi video hiện tại kết thúc
 * - Progress bar hiển thị tiến độ phát video
 * - Controls: Play, Pause, Replay
 * - Animation slide giữa các video
 * - Sử dụng GSAP ScrollTrigger để điều khiển animation
 */

// Import GSAP và các plugins
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
// Đăng ký plugin ScrollTrigger với GSAP
gsap.registerPlugin(ScrollTrigger);
// Import React hooks
import { useEffect, useRef, useState } from "react";

// Import dữ liệu slides và hình ảnh
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

/**
 * Component VideoCarousel - Carousel video highlights
 * 
 * @returns {JSX.Element} - Trả về carousel với video và controls
 */
const VideoCarousel = () => {
  /**
   * useRef - References đến các elements
   * videoRef: array chứa references đến tất cả video elements
   * videoSpanRef: array chứa references đến progress bar spans
   * videoDivRef: array chứa references đến progress bar containers
   */
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  /**
   * useState - Quản lý state của video player
   * isEnd: video hiện tại đã kết thúc chưa
   * startPlay: có bắt đầu phát chưa
   * videoId: index của video hiện tại (0, 1, 2, 3)
   * isLastVideo: có phải video cuối cùng không
   * isPlaying: video đang phát hay không
   */
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  /**
   * useState - Quản lý dữ liệu đã load của các video
   * loadedData: array chứa metadata của các video đã load
   */
  const [loadedData, setLoadedData] = useState([]);
  
  // Destructure để dễ sử dụng
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  /**
   * useGSAP - Hook để tạo animations với GSAP
   * 
   * Animations:
   * 1. Slider animation: dịch chuyển carousel để hiển thị video tương ứng
   * 2. Video animation: kích hoạt phát video khi scroll vào view
   */
  useGSAP(() => {
    /**
     * Animation slider - Dịch chuyển carousel
     * translateX(${-100 * videoId}%): dịch chuyển theo videoId
     * - videoId = 0: translateX(0%) - video đầu tiên
     * - videoId = 1: translateX(-100%) - video thứ 2
     * - videoId = 2: translateX(-200%) - video thứ 3
     * - videoId = 3: translateX(-300%) - video thứ 4
     */
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut", // Easing function - xem https://gsap.com/docs/v3/Eases
    });

    /**
     * Animation video - Kích hoạt phát video
     * ScrollTrigger: animation được kích hoạt khi scroll đến element
     */
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video", // Element trigger
        toggleActions: "restart none none none", // Hành động khi scroll
      },
      // Callback khi animation hoàn thành
      onComplete: () => {
        // Cập nhật state để bắt đầu phát video
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]); // Chạy lại khi isEnd hoặc videoId thay đổi

  /**
   * useEffect - Quản lý progress bar của video
   * 
   * Effect này:
   * 1. Tạo animation cho progress bar
   * 2. Cập nhật progress bar theo thời gian phát video
   * 3. Thay đổi màu và kích thước khi video kết thúc
   */
  useEffect(() => {
    let currentProgress = 0; // Lưu progress hiện tại
    let span = videoSpanRef.current; // Reference đến progress bar span

    if (span[videoId]) {
      /**
       * Animation cho progress bar
       * onUpdate: callback được gọi mỗi frame để cập nhật progress
       */
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          // Tính progress dựa trên animation progress (0-100%)
          const progress = Math.ceil(anim.progress() * 100);

          // Chỉ cập nhật khi progress thay đổi (tối ưu hiệu suất)
          if (progress != currentProgress) {
            currentProgress = progress;

            /**
             * Cập nhật width của progress bar container
             * Responsive: width khác nhau tùy kích thước màn hình
             */
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw" // Mobile: 10% viewport width
                  : window.innerWidth < 1200
                  ? "10vw" // Tablet: 10% viewport width
                  : "4vw", // Laptop/Desktop: 4% viewport width
            });

            /**
             * Cập nhật width và màu của progress bar
             * width: phần trăm đã phát
             * backgroundColor: màu trắng khi đang phát
             */
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        /**
         * onComplete: callback khi animation hoàn thành (video kết thúc)
         * Khi video kết thúc: thay đổi progress bar thành indicator nhỏ
         */
        onComplete: () => {
          if (isPlaying) {
            // Thu nhỏ progress bar thành indicator
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            // Đổi màu thành xám
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      // Restart animation nếu là video đầu tiên
      if (videoId == 0) {
        anim.restart();
      }

      /**
       * Function cập nhật progress bar theo thời gian thực của video
       * Tính progress = currentTime / videoDuration
       */
      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        /**
         * Thêm ticker để cập nhật progress bar mỗi frame
         * GSAP ticker chạy mỗi frame (~60fps)
         */
        gsap.ticker.add(animUpdate);
      } else {
        /**
         * Xóa ticker khi video pause
         * Tránh lãng phí tài nguyên khi không cần thiết
         */
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]); // Chạy lại khi videoId hoặc startPlay thay đổi

  /**
   * useEffect - Điều khiển phát/dừng video
   * 
   * Effect này:
   * 1. Chờ tất cả video load xong (loadedData.length > 3)
   * 2. Phát hoặc dừng video dựa trên state isPlaying
   */
  useEffect(() => {
    // Chỉ xử lý khi tất cả video đã load
    if (loadedData.length > 3) {
      if (!isPlaying) {
        // Dừng video nếu isPlaying = false
        videoRef.current[videoId].pause();
      } else {
        // Phát video nếu isPlaying = true và startPlay = true
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  /**
   * handleProcess - Function xử lý các sự kiện video
   * 
   * @param {string} type - Loại sự kiện: "video-end", "video-last", "video-reset", "pause", "play"
   * @param {number} i - Index của video (nếu cần)
   * 
   * Các trường hợp:
   * - "video-end": video kết thúc, chuyển sang video tiếp theo
   * - "video-last": video cuối cùng kết thúc
   * - "video-reset": reset về video đầu tiên
   * - "pause": tạm dừng video
   * - "play": phát video
   */
  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        // Video kết thúc: chuyển sang video tiếp theo (i + 1)
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        // Video cuối cùng kết thúc
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        // Reset về video đầu tiên (videoId = 0)
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        // Toggle isPlaying (từ true -> false)
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        // Toggle isPlaying (từ false -> true)
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  /**
   * handleLoadedMetaData - Callback khi video load metadata
   * 
   * @param {number} i - Index của video
   * @param {Event} e - Event object
   * 
   * Lưu metadata vào loadedData array để biết video nào đã load
   */
  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      {/* Container carousel chứa tất cả video */}
      <div className="flex items-center">
        {/* 
          .map() để render tất cả video slides
          list: data của mỗi slide
          i: index của slide
        */}
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              {/* Container video */}
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                {/* 
                  Video element
                  - id="video": để GSAP có thể tìm và animate
                  - playsInline: phát inline trên mobile
                  - ref: gán reference vào videoRef array
                  - onEnded: callback khi video kết thúc
                  - onPlay: callback khi video bắt đầu phát
                  - onLoadedMetadata: callback khi video load metadata
                */}
                <video
                  id="video"
                  playsInline={true}
                  className={`${
                    list.id === 2 && "translate-x-44" // Dịch chuyển video thứ 2 một chút
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() =>
                    // Nếu không phải video cuối: chuyển sang video tiếp theo
                    // Nếu là video cuối: đánh dấu là video cuối
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() =>
                    // Cập nhật state khi video bắt đầu phát
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              {/* Container text overlay trên video */}
              <div className="absolute top-12 left-[5%] z-10">
                {/* Render các dòng text từ textLists */}
                {list.textLists.map((text, i) => (
                  <p key={i} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Container controls: progress bars và nút play/pause/replay */}
      <div className="relative flex-center mt-10">
        {/* Container progress bars */}
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {/* 
            Render progress bar cho mỗi video
            videoRef.current.map(): tạo progress bar cho mỗi video
          */}
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              {/* Progress bar span - sẽ được GSAP animate */}
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        {/* Nút control: Play/Pause/Replay */}
        <button className="control-btn">
          {/* 
            Hiển thị icon khác nhau dựa trên state:
            - isLastVideo: hiển thị replay icon
            - !isPlaying: hiển thị play icon
            - isPlaying: hiển thị pause icon
          */}
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              // Xử lý click dựa trên state
              isLastVideo
                ? () => handleProcess("video-reset") // Reset về đầu nếu là video cuối
                : !isPlaying
                ? () => handleProcess("play") // Phát nếu đang dừng
                : () => handleProcess("pause") // Dừng nếu đang phát
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
