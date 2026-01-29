/**
 * constants/index.js - File chứa các constants (hằng số) của ứng dụng
 * 
 * File này export các dữ liệu tĩnh (static data) được sử dụng trong các components:
 * - navLists: danh sách menu items
 * - hightlightsSlides: dữ liệu cho video carousel
 * - models: dữ liệu các model iPhone (màu sắc)
 * - sizes: các kích thước iPhone
 * - footerLinks: các links ở footer
 */

// Import các assets từ utils
import {
  blackImg,
  blueImg,
  highlightFirstVideo,
  highlightFourthVideo,
  highlightSecondVideo,
  highlightThirdVideo,
  whiteImg,
  yellowImg,
} from "../utils";

/**
 * navLists - Danh sách các menu items trong Navbar
 * Array chứa các text sẽ hiển thị trong thanh menu
 */
export const navLists = ["Store", "Mac", "iPhone", "Support", "Chat"];

/**
 * hightlightsSlides - Dữ liệu cho video carousel highlights
 * 
 * Mỗi object chứa:
 * - id: số thứ tự
 * - textLists: array các dòng text hiển thị trên video
 * - video: đường dẫn video
 * - videoDuration: thời lượng video (giây) - dùng để tính progress bar
 */
export const hightlightsSlides = [
  {
    id: 1,
    textLists: [
      "Enter A17 Pro.",
      "Game‑changing chip.",
      "Groundbreaking performance.",
    ],
    video: highlightFirstVideo,
    videoDuration: 4, // 4 giây
  },
  {
    id: 2,
    textLists: ["Titanium.", "So strong. So light. So Pro."],
    video: highlightSecondVideo,
    videoDuration: 5, // 5 giây
  },
  {
    id: 3,
    textLists: [
      "iPhone 15 Pro Max has the",
      "longest optical zoom in",
      "iPhone ever. Far out.",
    ],
    video: highlightThirdVideo,
    videoDuration: 2, // 2 giây
  },
  {
    id: 4,
    textLists: ["All-new Action button.", "What will yours do?."],
    video: highlightFourthVideo,
    videoDuration: 3.63, // 3.63 giây
  },
];

/**
 * models - Dữ liệu các model iPhone (màu sắc)
 * 
 * Mỗi object chứa:
 * - id: số thứ tự
 * - title: tên model
 * - color: array 3 màu (để tạo gradient hoặc highlight)
 * - img: hình ảnh của model
 */
export const models = [
  {
    id: 1,
    title: "iPhone 15 Pro in Natural Titanium",
    color: ["#8F8A81", "#ffe7b9", "#6f6c64"], // Màu Natural Titanium
    img: yellowImg,
  },
  {
    id: 2,
    title: "iPhone 15 Pro in Blue Titanium",
    color: ["#53596E", "#6395ff", "#21242e"], // Màu Blue Titanium
    img: blueImg,
  },
  {
    id: 3,
    title: "iPhone 15 Pro in White Titanium",
    color: ["#C9C8C2", "#ffffff", "#C9C8C2"], // Màu White Titanium
    img: whiteImg,
  },
  {
    id: 4,
    title: "iPhone 15 Pro in Black Titanium",
    color: ["#454749", "#3b3b3b", "#181819"], // Màu Black Titanium
    img: blackImg,
  },
];

/**
 * sizes - Các kích thước iPhone
 * 
 * Mỗi object chứa:
 * - label: text hiển thị (ví dụ: '6.1"')
 * - value: giá trị để so sánh (ví dụ: "small")
 */
export const sizes = [
  { label: '6.1"', value: "small" },  // iPhone 15 Pro
  { label: '6.7"', value: "large" },   // iPhone 15 Pro Max
];

/**
 * footerLinks - Danh sách các links ở footer
 * Array chứa các text sẽ hiển thị như links ở chân trang
 */
export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];