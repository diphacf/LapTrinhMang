/**
 * main.jsx - File khởi tạo ứng dụng React
 * 
 * Đây là file entry point (điểm vào) của ứng dụng React.
 * File này có nhiệm vụ:
 * 1. Import các thư viện cần thiết
 * 2. Khởi tạo Sentry để theo dõi lỗi
 * 3. Render component App vào DOM
 */

// Import React và ReactDOM - thư viện cốt lõi để xây dựng giao diện người dùng
import React from 'react'
// ReactDOM dùng để render React components vào HTML DOM
import ReactDOM from 'react-dom/client'
// Import component App chính của ứng dụng
import App from './App.jsx'
// Import file CSS để style cho toàn bộ ứng dụng
import './index.css'

// Import Sentry - công cụ theo dõi lỗi và hiệu suất ứng dụng
import * as Sentry from "@sentry/react";

/**
 * Khởi tạo Sentry để theo dõi lỗi và hiệu suất
 * Sentry giúp phát hiện và báo cáo lỗi khi ứng dụng chạy
 */
Sentry.init({
  // DSN (Data Source Name) - địa chỉ để gửi dữ liệu lỗi về Sentry server
  dsn: "https://d674932a77e6d9b9ced1190d70fd4691@o4506876178464768.ingest.us.sentry.io/4506876181151744",
  // Các tích hợp (integrations) để theo dõi các khía cạnh khác nhau
  integrations: [
    // Theo dõi hiệu suất trình duyệt
    Sentry.browserTracingIntegration(),
    // Thu thập các metrics (số liệu) về hiệu suất
    Sentry.metrics.metricsAggregatorIntegration(),
    // Theo dõi routing (điều hướng) nếu dùng React Router
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
    }),
    // Ghi lại session replay (quay lại phiên làm việc) khi có lỗi
    Sentry.replayIntegration({
      maskAllText: false,    // Không che giấu text
      blockAllMedia: false,  // Không chặn media
    }),
  ],
  // Tỷ lệ lấy mẫu traces (100% = 1.0) - theo dõi tất cả các request
  tracesSampleRate: 1.0, 
  // Các target để theo dõi trace propagation
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Tỷ lệ ghi lại session replay thông thường (10%)
  replaysSessionSampleRate: 0.1,
  // Tỷ lệ ghi lại session replay khi có lỗi (100%)
  replaysOnErrorSampleRate: 1.0, 
});

/**
 * Render ứng dụng React vào DOM
 * 
 * ReactDOM.createRoot() tạo một root container để render React components
 * document.getElementById('root') tìm phần tử HTML có id="root" trong file index.html
 * 
 * React.StrictMode là một component đặc biệt giúp:
 * - Phát hiện các vấn đề tiềm ẩn trong ứng dụng
 * - Cảnh báo về các API không an toàn
 * - Chạy các effects 2 lần trong development để kiểm tra
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
