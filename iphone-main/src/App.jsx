/**
 * App.jsx - Component chính của ứng dụng
 * 
 * Component này là component gốc (root component) chứa tất cả các phần của website.
 * Nó sắp xếp các component con theo thứ tự từ trên xuống dưới.
 */

// Import các component con - mỗi component đại diện cho một phần của website
import Navbar from './components/Navbar';        // Thanh điều hướng ở đầu trang
import Hero from './components/Hero';            // Phần hero (banner chính) với video
import Highlights from './components/Highlights'; // Phần highlights với carousel video
import Model from './components/Model';          // Phần hiển thị model 3D của iPhone
import Features from './components/Features';    // Phần giới thiệu tính năng
import HowItWorks from './components/HowItWorks'; // Phần giải thích cách hoạt động
import Footer from './components/Footer';        // Phần chân trang

// Import Sentry để theo dõi hiệu suất của component này
import * as Sentry from '@sentry/react';

/**
 * Component App - Component chính của ứng dụng
 * 
 * Đây là một functional component (component dạng hàm)
 * Sử dụng arrow function syntax (cú pháp mũi tên)
 * 
 * @returns {JSX.Element} - Trả về cấu trúc HTML của ứng dụng
 */
const App = () => {
  return (
    // Thẻ <main> là thẻ HTML5 đại diện cho nội dung chính của trang
    // className="bg-black" là class của Tailwind CSS để đặt màu nền đen
    <main className="bg-black">
      {/* Navbar - Thanh điều hướng ở đầu trang với logo và menu */}
      <Navbar />
      
      {/* Hero - Phần banner chính với video và tiêu đề iPhone 15 Pro */}
      <Hero />
      
      {/* Highlights - Phần highlights với carousel video giới thiệu tính năng */}
      <Highlights />
      
      {/* Model - Phần hiển thị model 3D của iPhone, cho phép xem và chọn màu */}
      <Model />
      
      {/* Features - Phần giới thiệu chi tiết các tính năng của iPhone */}
      <Features />
      
      {/* HowItWorks - Phần giải thích về chip A17 Pro và hiệu suất */}
      <HowItWorks />
      
      {/* Footer - Phần chân trang với thông tin liên hệ và links */}
      <Footer />
    </main>
  )
}

/**
 * Export component App với Sentry Profiler
 * 
 * Sentry.withProfiler() bọc component App để theo dõi hiệu suất render
 * Giúp phát hiện các component render chậm hoặc có vấn đề
 */
export default Sentry.withProfiler(App);
