/**
 * Navbar.jsx - Component thanh điều hướng (Navigation Bar)
 * 
 * Component này tạo thanh menu ở đầu trang với:
 * - Logo Apple
 * - Danh sách các menu items (Store, Mac, iPhone, Support)
 * - Icons tìm kiếm và giỏ hàng
 */

// Import các hình ảnh cần thiết từ file utils
import { appleImg, bagImg, searchImg } from '../utils';
// Import danh sách menu từ file constants
import { navLists } from '../constants';

/**
 * Component Navbar - Thanh điều hướng
 * 
 * @returns {JSX.Element} - Trả về thanh menu với logo, menu items và icons
 */
const Navbar = () => {
  return (
    // Thẻ <header> là thẻ HTML5 đại diện cho phần đầu trang
    // className với Tailwind CSS:
    // - w-full: chiều rộng 100%
    // - py-5: padding top và bottom 5
    // - sm:px-10: padding left/right 10 trên màn hình nhỏ trở lên
    // - px-5: padding left/right 5 mặc định
    // - flex: hiển thị dạng flexbox
    // - justify-between: căn đều khoảng cách giữa các phần tử
    // - items-center: căn giữa theo chiều dọc
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      {/* Thẻ <nav> đại diện cho phần điều hướng */}
      <nav className="flex w-full screen-max-width">
        {/* Logo Apple - hình ảnh logo của Apple */}
        <img src={appleImg} alt="Apple" width={14} height={18} />

        {/* Container chứa danh sách menu items */}
        {/* max-sm:hidden: ẩn trên màn hình nhỏ hơn sm (mobile) */}
        <div className="flex flex-1 justify-center max-sm:hidden">
          {/* 
            .map() là method của JavaScript array để duyệt qua từng phần tử
            navLists.map() tạo ra một danh sách các menu items
            key={nav} là prop bắt buộc trong React để định danh mỗi phần tử
          */}
          {navLists.map((nav) => (
            <div 
              key={nav} 
              className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
            >
              {/* Hiển thị text của menu item */}
              {nav}
            </div>
          ))}
        </div>

        {/* Container chứa icons tìm kiếm và giỏ hàng */}
        {/* max-sm:justify-end: căn về bên phải trên mobile */}
        <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
          {/* Icon tìm kiếm */}
          <img src={searchImg} alt="search" width={18} height={18} />
          {/* Icon giỏ hàng */}
          <img src={bagImg} alt="bag" width={18} height={18} />
        </div>
      </nav>
    </header>
  )
}

// Export component để có thể import ở file khác
export default Navbar