/**
 * Footer.jsx - Component phần chân trang (Footer)
 * 
 * Component này hiển thị:
 * - Thông tin mua hàng (More ways to shop)
 * - Số điện thoại liên hệ
 * - Copyright
 * - Các links footer (Privacy Policy, Terms of Use, etc.)
 */

// Import React
import React from 'react'
// Import danh sách footer links từ constants
import { footerLinks } from '../constants'

/**
 * Component Footer - Phần chân trang
 * 
 * @returns {JSX.Element} - Trả về footer với thông tin và links
 */
const Footer = () => {
  return (
    // Thẻ <footer> là thẻ HTML5 đại diện cho phần chân trang
    <footer className="py-5 sm:px-10 px-5">
      <div className="screen-max-width">
        {/* Container thông tin mua hàng */}
        <div>
          {/* Text "More ways to shop" với các links */}
          <p className="font-semibold text-gray text-xs">
            More ways to shop: {' '}
            {/* Link "Find an Apple Store" */}
            <span className="underline text-blue">
              Find an Apple Store {' '}
            </span>
            or {' '}
            {/* Link "other retailer" */}
            <span className="underline text-blue">
              other retailer
            </span>{' '}
            near you.
          </p>
          {/* Số điện thoại */}
          <p className="font-semibold text-gray text-xs">
            Or call 000800-040-1966
          </p>
        </div>

        {/* Đường kẻ ngăn cách */}
        <div className="bg-neutral-700 my-5 h-[1px] w-full" />

        {/* Container copyright và footer links */}
        <div className="flex md:flex-row flex-col md:items-center justify-between">
          {/* Copyright text */}
          <p className="font-semibold text-gray text-xs">Copright @ 2024 Apple Inc. All rights reserved.</p>
          
          {/* Container các footer links */}
          <div className="flex">
            {/* 
              .map() để render danh sách footer links
              i: index của phần tử trong array
            */}
            {footerLinks.map((link, i) => (
              <p key={link} className="font-semibold text-gray text-xs">
                {link}{' '}
                {/* 
                  Hiển thị dấu "|" giữa các links, nhưng không hiển thị sau link cuối cùng
                  i !== footerLinks.length - 1: kiểm tra không phải phần tử cuối
                */}
                {i !== footerLinks.length - 1 && (
                  <span className="mx-2"> | </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer