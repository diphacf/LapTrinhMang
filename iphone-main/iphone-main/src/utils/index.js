/**
 * utils/index.js - File chứa các utilities (tiện ích)
 * 
 * File này export tất cả các assets (hình ảnh, video) để sử dụng trong các components
 * Mục đích: tập trung quản lý assets ở một nơi, dễ bảo trì và tái sử dụng
 */

// ========== HÌNH ẢNH ==========

// Import hình ảnh hero
import hero from "/assets/images/hero.jpeg";
// Export để sử dụng ở components khác
export const heroImg = hero;

// Import các icon SVG
import apple from "/assets/images/apple.svg";
import search from "/assets/images/search.svg";
import bag from "/assets/images/bag.svg";
import watch from "/assets/images/watch.svg";
import right from "/assets/images/right.svg";
import replay from "/assets/images/replay.svg";
import play from "/assets/images/play.svg";
import pause from "/assets/images/pause.svg";

// Import hình ảnh màu iPhone
import yellow from "/assets/images/yellow.jpg";
import blue from "/assets/images/blue.jpg";
import white from "/assets/images/white.jpg";
import black from "/assets/images/black.jpg";

// Import hình ảnh khác
import explore1 from "/assets/images/explore1.jpg";
import explore2 from "/assets/images/explore2.jpg";
import chip from "/assets/images/chip.jpeg";
import frame from "/assets/images/frame.png";

// ========== VIDEO ==========

// Import video hero (video lớn cho desktop)
import hmv from "/assets/videos/hero.mp4";
// Import video hero nhỏ (cho mobile)
import smallmv from "/assets/videos/smallHero.mp4";

// Import các video highlights
import highlightFirstmv from "/assets/videos/highlight-first.mp4";
import highlightSectmv from "/assets/videos/hightlight-third.mp4";
import highlightThirdmv from "/assets/videos/hightlight-sec.mp4";
import highlightFourthmv from "/assets/videos/hightlight-fourth.mp4";

// Import video explore và frame
import exploremv from "/assets/videos/explore.mp4";
import framemv from "/assets/videos/frame.mp4";

// ========== EXPORT VIDEO ==========

// Export các video để sử dụng trong components
export const heroVideo = hmv;
export const smallHeroVideo = smallmv;
export const highlightFirstVideo = highlightFirstmv;
export const highlightSecondVideo = highlightSectmv;
export const highlightThirdVideo = highlightThirdmv;
export const highlightFourthVideo = highlightFourthmv;
export const exploreVideo = exploremv;
export const frameVideo = framemv;

// ========== EXPORT HÌNH ẢNH ==========

// Export các icon
export const appleImg = apple;
export const searchImg = search;
export const bagImg = bag;
export const watchImg = watch;
export const rightImg = right;
export const replayImg = replay;
export const playImg = play;
export const pauseImg = pause;

// Export hình ảnh màu iPhone
export const yellowImg = yellow;
export const blueImg = blue;
export const whiteImg = white;
export const blackImg = black;

// Export hình ảnh khác
export const explore1Img = explore1;
export const explore2Img = explore2;
export const chipImg = chip;
export const frameImg = frame;